import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React from "react";

interface Props{
    customTableHead: React.ReactNode,
    children: React.ReactNode,
    style: any,
    stickyHeader: boolean,
}

export function CustomTable(props: Props) {
    const { children, customTableHead, style, stickyHeader } = props;
    const classes = style();

    return (
        <TableContainer className={classes.container}>
            <Table className={classes.root} stickyHeader={stickyHeader}>
                {customTableHead}
                <TableBody>
                    {children}
                </TableBody>
            </Table>
        </TableContainer>
    );
}