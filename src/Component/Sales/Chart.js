import { useState, useEffect } from 'react';
// import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import {
    XAxis,
    Line,
    YAxis,
    Tooltip,
    LineChart,
    ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import { useTheme } from '@material-ui/core';
const initData = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
};
export default function Chart({ products }) {
    const [data, setData] = useState([]);
    // const { language } = useContext(LanguageContext);
    const theme = useTheme();
    useEffect(() => {
        products.forEach((e) => {

            const month = moment(e.date, 'YYYY-MM-DD').format('M');
            const profit=e.sellingPrice - e.buyingPrice
            initData[month] = initData[month] + profit;
        });
        const newData = [];
        Object.keys(initData).forEach((e) => {
            newData.push({ month: e, profit: initData[e] });
        });
        setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    return (
        <>
        <ResponsiveContainer style={{ hieght: '300px' }}>
            <LineChart data={data}>
                <Tooltip />
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                    dataKey="profit"
                    type="monotone"
                    stroke={theme.palette.primary.main}
                />
            </LineChart>
            </ResponsiveContainer>
            </>
    );
}
