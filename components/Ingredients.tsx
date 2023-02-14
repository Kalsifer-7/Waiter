import { IconButton, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import Style from '../styles/Expand';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Product } from "../lib/API";

interface Props{
    ingredients: string
}

export function Ingredients(props: Props) {
	const { ingredients } = props;
    return (
        <List>
            {ingredients.split('\n').map((ingredient: string) => (
                <ListItem>
                    <ListItemIcon>
                        <img src={"/assets/misc/ingredient.png"}></img>
                    </ListItemIcon>
                    <ListItemText primary={ingredient}/>
                </ListItem>
            ))}
        </List>
    )
}