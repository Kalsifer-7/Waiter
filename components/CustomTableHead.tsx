import { TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";

interface Props{
    columns: string[]
}

export function CustomTableHead(props: Props) {
    const { columns } = props;

    return (
        <TableHead>
            <TableRow>
                {
                    columns.map((title: string, index: number) => {
                        return <TableCell key={index}>{title}</TableCell>
                    })
                }
            </TableRow>
        </TableHead>
    )
}