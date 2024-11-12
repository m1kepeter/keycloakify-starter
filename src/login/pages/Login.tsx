import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, Stack, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div>
                    <div>
                        <Typography variant="body1">
                            {msg("noAccount")}{" "}
                            <Link tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </Link>
                        </Typography>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <Box
                            id="kc-social-providers"
                            className={kcClsx("kcFormSocialAccountSectionClass")}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%",
                                maxWidth: 400,
                                margin: "0 auto"
                            }}
                        >
                            <hr style={{ width: "100%" }} />
                            <Typography variant="body2" sx={{ textAlign: "center", marginBottom: 2 }}>
                                {msg("identity-provider-login-label")}
                            </Typography>
                            <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                                {social.providers.map((...[p, , providers]) => (
                                    <Button
                                        key={p.alias}
                                        id={`social-${p.alias}`}
                                        variant="contained"
                                        startIcon={
                                            p.iconClasses && (
                                                <i
                                                    className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)}
                                                    aria-hidden="true"
                                                    style={{ color: "white", fontSize: 24 }}
                                                ></i>
                                            )
                                        }
                                        href={p.loginUrl}
                                        sx={{
                                            width: "100%",
                                            textTransform: "none",
                                            display: "flex",
                                            justifyContent: "center", // Zentriert den gesamten Inhalt
                                            alignItems: "center", // Zentriert Icon und Text vertikal
                                            padding: "10px",
                                            color: "white",
                                            gap: "10px",
                                            backgroundColor: "#6E85A3",
                                            "&:hover": {
                                                backgroundColor: "#5C728F"
                                            },
                                            margin: "0 auto"
                                        }}
                                    >
                                        <Box component="span">
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </Box>
                                    </Button>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <TextField
                                        sx={{
                                            width: "100%",
                                            minWidth: 350,
                                            pb: 2
                                        }}
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")
                                        }
                                        tabIndex={2}
                                        variant="outlined"
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        autoFocus
                                        autoComplete="username"
                                        error={messagesPerField.existsError("username", "password")}
                                        helperText={
                                            messagesPerField.existsError("username", "password") && (
                                                <span
                                                    aria-live="polite"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className={kcClsx("kcFormGroupClass")}>
                                <FormControl sx={{ width: "100%" }} variant="outlined" error={messagesPerField.existsError("username", "password")}>
                                    <InputLabel htmlFor="outlined-adornment-password" error={messagesPerField.existsError("username", "password")}>
                                        {msg("password")}
                                    </InputLabel>
                                    <OutlinedInput
                                        tabIndex={3}
                                        name="password"
                                        autoComplete="current-password"
                                        type={showPassword ? "text" : "password"}
                                        error={messagesPerField.existsError("username", "password")}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? "hide the password" : "display the password"}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={e => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    {usernameHidden && messagesPerField.existsError("username", "password") && (
                                        <FormHelperText>
                                            <span
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <FormControlLabel
                                            control={<Checkbox tabIndex={5} name="rememberMe" defaultChecked={!!login.rememberMe} />}
                                            label={msg("rememberMe")}
                                        />
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <Link
                                                sx={{
                                                    display: "inline-block",
                                                    position: "relative",
                                                    top: 14,
                                                    fontFamily: "Geist"
                                                }}
                                                tabIndex={6}
                                                href={url.loginResetCredentialsUrl}
                                            >
                                                {msg("doForgotPassword")}
                                            </Link>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button sx={{ width: "100%" }} tabIndex={7} variant="contained" type="submit" name="login">
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
