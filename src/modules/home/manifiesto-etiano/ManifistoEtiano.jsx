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
                            {t("subtitle")}
                        </Typography>
                        {t("manifest")}

                    </Typography>
                </Box>

            </Container>
        </React.Fragment>
    );
}

export default ManifiestoETiano;
