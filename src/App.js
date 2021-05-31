import React, { useMemo, useState, useEffect } from 'react';

import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import { ThemeProvider } from '@material-ui/core/styles';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    DialogTitle,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import teal from '@material-ui/core/colors/teal';
import indigo from '@material-ui/core/colors/indigo';
import CssBaseLine from '@material-ui/core/CssBaseline';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SideBar from './Component/SideBar/SideBar';
import Products from './Component/Products/Products';
import WareHouse from './Component/WareHouse/WareHouse';
import Sales from './Component/Sales/Sales';
import { LanguageProvider } from './GlobalStates/Langauges/LanguageState';
const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            height: '100vh',
            width: '100%',
            overFlow: 'hidden',
            gap: '2rem',
        },
    })
);

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const classes = useStyles();
    const [isDark, setIsDark] = useState(prefersDarkMode);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: isDark ? 'dark' : 'light',
                    primary: {
                        main: teal['A400'],
                    },
                    secondary: {
                        main: indigo[isDark ? '50' : '700'],
                    },
                },
                typography: {
                    fontFamily: " 'Tajawal', sans-serif ",
                },
                overrides: {
                    MuiCssBaseline: {
                        '@global': {
                            '*::-webkit-scrollbar': {
                                width: '0.4em',
                                height: '0.7em',
                            },

                            '*::-webkit-scrollbar-thumb': {
                                backgroundColor: teal['A400'],
                                borderRadius: '10px',
                            },
                        },
                    },
                },
            }),
        [isDark]
    );
    useEffect(() => {
        window.api.listen('show-error', (e, data) => {
            handleShowError(data);
        });
        return () => {
            window.api.remove('show-error');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function handleShowError(data) {
        console.log(data);
        if (openErrorDialog) {
            setErrorMessage('');
            setOpenErrorDialog(false);
        } else {
            setErrorMessage(data.msg);
            setOpenErrorDialog(true);
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseLine />
            <LanguageProvider>
                <Router>
                    <Grid
                        container
                        className={classes.root}
                        direction="row-reverse"
                    >
                        <Dialog
                            open={openErrorDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Error
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {errorMessage}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => handleShowError()}
                                    color="primary"
                                >
                                    ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Grid item md={2} xs={3}>
                            <SideBar isDark={isDark} setIsDark={setIsDark} />
                        </Grid>
                        <Grid item md={9} xs={8}>
                            <Switch>
                                <Route path="/sales">
                                    <Sales />
                                </Route>
                                <Route path="/warehouse">
                                    <WareHouse />
                                </Route>
                                <Route path="/products">
                                    <Products />
                                </Route>
                            </Switch>
                        </Grid>
                    </Grid>
                </Router>
            </LanguageProvider>
        </ThemeProvider>
    );
}
export default App;
