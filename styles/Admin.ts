import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
    },
    chart: {
    },
    tabPanel: {
    },
    highlight: {
        backgroundColor: theme.palette.secondary.light,
    },
    notPaidHighlight: {
        backgroundColor: theme.palette.primary.light,
    },
    paidHighlight: {
        backgroundColor: theme.palette.success.light,
    },
}));