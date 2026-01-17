
export interface ColumnStats {
    type: 'number' | 'string' | 'date' | 'boolean' | 'mixed';
    uniqueCount: number;
    emptyCount: number;
    totalCount: number;
    topValues: { value: string; count: number }[]; // For frequency distribution
    numericStats?: {
        min: number;
        max: number;
        avg: number;
        sum: number;
    };
}

export function analyzeColumn(data: any[], column: string): ColumnStats {
    const values = data.map(row => row[column]);
    const totalCount = values.length;
    let emptyCount = 0;
    const definedValues: any[] = [];
    const valueCounts: Record<string, number> = {};

    // 1. First Pass: Collection & Basic Counting
    values.forEach(val => {
        if (val === null || val === undefined || val === "") {
            emptyCount++;
        } else {
            definedValues.push(val);
            const strVal = String(val);
            valueCounts[strVal] = (valueCounts[strVal] || 0) + 1;
        }
    });

    const uniqueCount = Object.keys(valueCounts).length;

    // 2. Type Detection
    let type: ColumnStats['type'] = 'string';
    let numericValues: number[] = [];

    const isNumber = definedValues.every(val => !isNaN(Number(val)) && val !== "");
    // Simple date check (could be improved)
    const isDate = !isNumber && definedValues.every(val => !isNaN(Date.parse(val)));
    const isBoolean = !isNumber && !isDate && definedValues.every(val =>
        String(val).toLowerCase() === 'true' ||
        String(val).toLowerCase() === 'false' ||
        val === 0 || val === 1
    );

    if (definedValues.length === 0) type = 'mixed';
    else if (isNumber) {
        type = 'number';
        numericValues = definedValues.map(v => Number(v));
    }
    else if (isDate) type = 'date';
    else if (isBoolean) type = 'boolean';

    // 3. Numeric Stats (if applicable)
    let numericStats;
    if (type === 'number' && numericValues.length > 0) {
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const avg = sum / numericValues.length;
        numericStats = { min, max, sum, avg };
    }

    // 4. Top Values (Frequency Distribution) for Charts
    // Sort by count desc
    const sortedCounts = Object.entries(valueCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10) // Top 10 for chart
        .map(([value, count]) => ({ value: value.length > 15 ? value.substring(0, 15) + '...' : value, count }));

    return {
        type,
        uniqueCount,
        emptyCount,
        totalCount,
        topValues: sortedCounts,
        numericStats
    };
}
