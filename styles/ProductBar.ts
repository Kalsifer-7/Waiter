import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        position: "relative",
        padding: "1%",
        margin: theme.spacing(2),
        width: "20%",
        [theme.breakpoints.down('xs')]: {
            minWidth: "70%",    
        },
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    content: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
    },
    name: {
    },
    price: {
        marginLeft: "auto",
        fontWeight: "bold"
    },
    actions: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        position: "relative",
    },
}));