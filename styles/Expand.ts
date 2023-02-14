import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    expand: {
            marginLeft: "auto",
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));