import { Fragment } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import Button from "@mui/material/Button";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { otpLogin, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <form id="kc-otp-login-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className={kcClsx("kcFormGroupClass")}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="otp-selection" name="selectedCredentialId" defaultValue={otpLogin.selectedCredentialId}>
                                {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                                    <FormControlLabel key={index} value={otpCredential.id} control={<Radio />} label={otpCredential.userLabel} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </div>
                )}

                <div className={kcClsx("kcFormGroupClass")}>
                    <TextField
                        sx={{
                            width: "100%",
                            minWidth: 350,
                            pb: 2
                        }}
                        name="otp"
                        autoComplete="off"
                        label={msg("loginOtpOneTime")}
                        type="password"
                        autoFocus
                        error={messagesPerField.existsError("totp")}
                        helperText={
                            <span
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("totp"))
                                }}
                            />
                        }
                    />
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <Button sx={{ width: "100%" }} variant="contained" type="submit" name="login">
                        {msgStr("doLogIn")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
