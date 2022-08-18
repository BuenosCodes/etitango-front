import * as React from "react";
import {Typography, Box, Container} from '@mui/material';
import {useTranslation} from "react-i18next";
import {SCOPES} from "helpers/constants/i18n.ts";

const item = {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    px: 5,
    height: "100vh",

};

function ComisionGeneroProtocol() {
    const {t} = useTranslation(SCOPES.MODULES.HOME.GENDER.PROT, {useSuspense: false});
    return (
        <React.Fragment>
            <Container>
                <Box sx={item}>
                    <Typography variant="h4" align="center" component="h2" my="25px">{t("title")}</Typography>
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_1")} </Typography>
                    <Typography> {t("body_1")} </Typography>
                    <Typography> {t("def_1")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_2")} </Typography>
                    <Typography> {t("body_2")} </Typography>
                    <Typography> {t("body_3")} </Typography>
                    <Typography> {t("body_4")} </Typography>
                    <Typography> {t("body_5")} </Typography>
                    <Typography> {t("body_6")} </Typography>
                    <Typography> {t("body_7")} </Typography>
                    <Typography> {t("body_8")} </Typography>
                    <Typography> {t("body_9")} </Typography>
                    <Typography> {t("body_10")} </Typography>
                    <Typography> {t("body_11")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_3")} </Typography>
                    <Typography> {t("body_12")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_4")} </Typography>
                    <Typography> {t("body_13")} </Typography>
                    <Typography> {t("body_14")} </Typography>
                    <Typography> {t("body_15")} </Typography>
                    <Typography> {t("body_16")} </Typography>
                    <Typography> {t("body_17")} </Typography>
                    <Typography> {t("body_18")} </Typography>
                    <Typography> {t("body_19")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_5")} </Typography>
                    <Typography> {t("body_20")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_6")} </Typography>
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_7")} </Typography>
                    <Typography> {t("body_21")} </Typography>
                    <Typography> {t("body_22")} </Typography>
                    <Typography> {t("body_23")} </Typography>
                    <Typography> {t("body_24")} </Typography>
                    <Typography> {t("body_25")} </Typography>
                    <Typography> {t("body_26")} </Typography>
                    <Typography> {t("body_27")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_8")} </Typography>
                    <Typography> {t("body_28")} </Typography>
                    <Typography> {t("body_29")} </Typography> <br />
                    <Typography variant="h6" gutterBottom component="div"> {t("subtitle_9")} </Typography>
                    <Typography variant="h6" gutterBottom component="div"> {t("body_30")} </Typography>
                    <Typography> {t("body_31")} </Typography>
                    <Typography> {t("body_32")} </Typography>
                    <Typography> {t("body_33")} </Typography>
                    <Typography> {t("body_34")} </Typography>
                    <Typography> {t("body_35")} </Typography>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default ComisionGeneroProtocol;