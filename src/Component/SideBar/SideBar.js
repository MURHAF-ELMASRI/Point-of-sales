import { useState, useContext } from 'react';
import { LanguageContext } from '../../GlobalStates/Langauges/LanguageState';
import dectionary from '../../GlobalStates/Langauges/dectionary';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Store from '@material-ui/icons/Store';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import TranslateIcon from '@material-ui/icons/Translate';
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import IconButton from '@material-ui/core/IconButton';
import { useLocation, Link } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
const useStyles = makeStyles((theme) =>
    createStyles({
        List: {
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            width: '100%',
            height: '100%',
            paddingTop: theme.spacing(5),
            overflow: 'hidden',
        },
        Link: {
            color: theme.palette.text.primary,
            textDecoration: 'none',
        },
        active: {
            background: theme.palette.primary.main,
        },
        menu: {
            position: 'absolute',
        },
    })
);
export default function SideBar({ setIsDark, isDark }) {
    const classes = useStyles();
    const { setLanguage, language } = useContext(LanguageContext);
    const location = useLocation();
    const [langMenuAnchor, setLangMenuAnchor] = useState(null);
    const toggleActive = (route) => {
        return location.pathname === route ? classes.active : null;
    };
    const handleCloseMenu = (data) => {
        setLanguage(dectionary[data]);
        setLangMenuAnchor(null);
    };
    return (
        <>
            <List className={classes.List}>
                <ListItem>
                    <IconButton onClick={() => setIsDark((prev) => !prev)}>
                        {isDark ? <Brightness3Icon /> : <BrightnessLowIcon />}
                    </IconButton>
                    <IconButton
                        aria-controls="translation"
                        onClick={(e) => setLangMenuAnchor(e.currentTarget)}
                    >
                        <TranslateIcon />
                    </IconButton>
                    <Menu
                        className={classes.menu}
                        id="translation"
                        aria-haspopup="true"
                        open={Boolean(langMenuAnchor)}
                        anchorEl={langMenuAnchor}
                    >
                        {['arabic', 'english', 'turkish'].map((e, i) => {
                            return (
                                <MenuItem
                                    key={i}
                                    onClick={() => handleCloseMenu(e)}
                                    value={e}
                                >
                                    {e}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </ListItem>
                <ListItem
                    component={Link}
                    className={toggleActive('/sales')}
                    to="/sales"
                    button
                >
                    <ListItemIcon>
                        <AttachMoney />
                    </ListItemIcon>
                    <ListItemText primary={language['sales']} />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    className={toggleActive('/warehouse')}
                    to="/warehouse"
                >
                    <ListItemIcon>
                        <Store />
                    </ListItemIcon>
                    <ListItemText primary={language['wareHouse']} />
                </ListItem>

                <ListItem
                    className={toggleActive('/products')}
                    button
                    component={Link}
                    to="/products"
                >
                    <ListItemIcon>
                        <ShoppingBasket />
                    </ListItemIcon>
                    <ListItemText primary={language['products']} />
                </ListItem>
            </List>
        </>
    );
}
