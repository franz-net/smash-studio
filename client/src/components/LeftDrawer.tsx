import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from "@mui/material";
import {AddCircleOutlineOutlined, HomeOutlined} from "@mui/icons-material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface LeftDrawerProps {
    drawerWidth: number
    handleDrawerToggle: () => void
    mobileOpen: boolean

}

export default function LeftDrawer({drawerWidth, handleDrawerToggle, mobileOpen}: LeftDrawerProps) {
    const theme = useTheme();
    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        path: string
    ) => {
        setSelectedIndex(index)
        navigate(path)
    }


    const menuItems = [
        {
            text: 'Home',
            icon: <HomeOutlined color="secondary"/>,
            path: '/'
        },
        {
            text: 'Add Reservation',
            icon: <AddCircleOutlineOutlined color="secondary"/>,
            path: '/calendar'
        },

    ]

    const drawer = (
        <div>
            <Typography variant="h5" sx={{padding: theme.spacing(2)}}>
                Smash Studio
            </Typography>
            <Divider/>

            <List>
                {menuItems.map((item, index) => (
                    <ListItemButton
                        key={index}
                        selected={selectedIndex === index}
                        onClick={
                            (event) => handleListItemClick(event, index, item.path)
                        }>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text}/>
                    </ListItemButton>
                ))}
            </List>
        </div>
    )

    return (
        <Box
            component="nav"
            sx={{
                width: {sm: drawerWidth},
                flexShrink: {sm: 0}
            }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                className="drawer"
                anchor="left"
                sx={{
                    display: {xs: 'block', sm: 'none'},
                    '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
                }}
            >
                {drawer}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: {xs: 'none', sm: 'block'},
                    '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    )
}