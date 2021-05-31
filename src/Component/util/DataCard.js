import { Typography, Card, CardContent, Grid } from '@material-ui/core';

import { useContext } from 'react';
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
export default function DataCard(props) {
    const { language } = useContext(LanguageContext);
    return (
        <Card>
            <CardContent>
                <Grid container spacing={4}>
                    {Object.keys(props.data).map((e) => (
                        <Grid item md={4} key={e}>
                            <Typography color="secondary">
                                {language[e]}
                            </Typography>
                            <Typography>{props.data[e]}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}
