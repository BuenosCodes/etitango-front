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

function ManifiestoETiano() {
    const {t} = useTranslation(SCOPES.MODULES.HOME.MANIFEST, {useSuspense: false});
    return (
        <React.Fragment>

            <Container>
                <Box sx={item}>


                    <Typography variant="h4" align="center" component="h2" my="25px">{t("title")}</Typography>
                    <Typography variant="body1" gutterBottom>

                        <Typography variant="h6" gutterBottom component="div">
                            {t("subtitle_1")}
                        </Typography>
                        {t("manifest_p1")}
                        <Typography variant="h6" gutterBottom component="div">
                            {t("subtitle_2")}
                        </Typography>
                        {t("manifest_p2")}
                        <Typography variant="h6" gutterBottom component="div">
                            {t("subtitle_3")}
                        </Typography>
                        {t("manifest_p3")}
                        <Typography variant="h6" gutterBottom component="div">
                            {t("subtitle_4_1")}
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div">
                            {t("subtitle_4_2")}
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div"> {/* TODO variant="h7" "small-right" */}
                            {t("subtitle_4_3")}
                        </Typography>
                        {t("manifest_p4")}
                        

                    </Typography>
                </Box>

            </Container>
        </React.Fragment>
    );
}

export default ManifiestoETiano;
