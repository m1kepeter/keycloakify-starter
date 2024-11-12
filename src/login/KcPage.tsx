import "./assets/font/main.css";
import { Suspense, lazy, useEffect, useState } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import { tss } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundPng from "./assets/img/background.png";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Login = lazy(() => import("./pages/Login"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginUsername = lazy(() => import("./pages/LoginUsername"));
const Error = lazy(() => import("./pages/Error"));

const doMakeUserConfirmPassword = true;

// Themes for light and dark mode
const getLightTheme = () =>
    createTheme({
        palette: {
            primary: {
                light: "#757ce8",
                main: "#304B6A",
                contrastText: "#fff"
            },
            secondary: {
                light: "#ff7961",
                main: "#304B6A",
                contrastText: "#000"
            },
            mode: "light"
        },
        typography: {
            fontFamily: "Geist"
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        "&:hover": {
                            backgroundColor: "#556080" // Deine gewünschte Hover-Farbe
                        }
                    }
                }
            }
        }
    });

const getDarkTheme = () =>
    createTheme({
        palette: {
            primary: {
                main: "#304B6A",
                dark: "#002884",
                contrastText: "#fff"
            },
            secondary: {
                main: "#304B6A",
                dark: "#ba000d",
                contrastText: "#000"
            },
            mode: "dark"
        },
        typography: {
            fontFamily: "Geist"
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        "&:hover": {
                            backgroundColor: "#556080" // Deine gewünschte Hover-Farbe
                        }
                    }
                }
            }
        }
    });

export default function KcPage(props: { kcContext: KcContext }) {
    const [theme, setTheme] = useState(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? getDarkTheme()
            : getLightTheme()
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? getDarkTheme() : getLightTheme());
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <KcPageContextualized {...props} />
        </ThemeProvider>
    );
}

function KcPageContextualized(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const { classes } = useStyles();

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-otp.ftl":
                        return (
                            <LoginOtp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-username.ftl":
                        return (
                            <LoginUsername
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "error.ftl":
                        return (
                            <Error
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const useStyles = tss.create(
    ({ theme }) =>
        ({
            kcHtmlClass: {
                ":root": {
                    colorScheme: theme.palette.mode
                }
            },
            kcBodyClass: {
                backgroundColor: theme.palette.background.default,
                background: `url(${backgroundPng}) space center center fixed`,
                color: theme.palette.text.primary
            }
        }) satisfies { [key in ClassKey]?: unknown }
);
