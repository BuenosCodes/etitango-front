import * as React from "react";
import {Typography, Box, Container} from '@mui/material';
import {useTranslation} from "react-i18next";
import {SCOPES} from "helpers/constants/i18n.ts";

const item = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
    height: "100vh",

};

function ComisionGeneroWho() {
    const {t} = useTranslation(SCOPES.MODULES.HOME.GENDER.WHO, {useSuspense: false});
    return (
        <React.Fragment>
            <Container>
                <Box sx={item}>
                    <Typography variant="h4" align="center" component="h2" my="25px">{t("title")}</Typography>
                    <Typography variant="body1" gutterBottom>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_1")} </Typography>
                        <ul>{t('body_1')
                        .split('\n')
                        .map((tx) => (
                            <Typography> {tx}</Typography>
                        ))}{' '}
                        </ul>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_2")} </Typography>
                        <ul><Typography> {t("body_2")} </Typography></ul>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_3")} </Typography>
                        <ul>{t('body_3')
                        .split('\n')
                        .map((tx) => (
                            <Typography> {tx}</Typography>
                        ))}{' '}
                        </ul>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_4")} </Typography>
                        <ul>{t('body_4')
                        .split('\n')
                        .map((tx) => (
                            <Typography> {tx}</Typography>
                        ))}{' '}
                        </ul>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_5")} </Typography>
                        <ul>{t('body_5')
                        .split('\n')
                        .map((tx) => (
                            <li><Typography> {tx}</Typography></li>
                        ))}{' '}
                        </ul>
                        <br />
                        <br />
                    </Typography>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default ComisionGeneroWho;