import { ResponsiveContainer, PieChart, Pie, Tooltip } from 'recharts';
import { useState, useEffect, memo } from 'react';
import { useTheme } from '@material-ui/core';

export default memo(({ products }) => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    useEffect(() => {
        const objOfType = {};
        products.forEach((e) => {
            if (!objOfType[e.type]) objOfType[e.type] = 0;
            objOfType[e.type]++;
        });
        const newData = [];
        Object.keys(objOfType).forEach((e) => {
            newData.push({ name: e, value: objOfType[e] });
        });
        setData(newData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    return (
        <ResponsiveContainer>
            <PieChart width={200} height={200}>
                <Tooltip />
                <Pie
                    data={data}
                    dataKey="value"
                    fill={theme.palette.primary.main}
                    label
                />
            </PieChart>
        </ResponsiveContainer>
    );
});
