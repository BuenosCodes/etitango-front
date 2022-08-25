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
                        <Typography> {t("body_1")} </Typography>
                        <Typography> {t("body_2")} </Typography>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_2")} </Typography>
                        <Typography> {t("body_3")} </Typography>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_3")} </Typography>
                        <Typography> {t("body_4")} </Typography>
                        <Typography> {t("body_5")} </Typography>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_4")} </Typography>
                        <Typography> {t("body_6")} </Typography>
                        <Typography> {t("body_7")} </Typography>
                        <Typography variant="h6" gutterBottom component="div"> {t("subtitle_5")} </Typography>
                        <Typography> {t("body_8")} </Typography>
                        <Typography> {t("body_9")} </Typography>
                        <Typography> {t("body_10")} </Typography>
                    </Typography>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default ComisionGeneroWho;