import { IconButton } from "@material-ui/core";
import React from "react";
import Style from '../styles/Expand';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props{
    expanded: boolean,
    handleExpandClick(itemId: number): void,
    itemId: number,
    selectedId: number | undefined,
}

export function ExpandButton(props: Props) {
    const { expanded, itemId, selectedId, handleExpandClick } = props;
    const classes = Style();

    return (
        <IconButton
        className={clsx(classes.expand, {
            [classes.expandOpen]: expanded && itemId == selectedId,
        })}
        onClick={() => handleExpandClick(itemId)}
        >
            <ExpandMoreIcon />
        </IconButton>
    )
}