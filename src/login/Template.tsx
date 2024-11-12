import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { useStyles } from "tss-react/mui";
import logoPng from "./assets/img/logo.png";
import { Typography } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    const { css, theme, cx } = useStyles();

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div
            className={cx(
                kcClsx("kcLoginClass"),
                css({
                    height: "100vh",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "center"
                })
            )}
        >
            <div id="kc-header" className={kcClsx("kcHeaderClass")}></div>
            <div
                //className={kcClsx("kcFormCardClass")}
                className={css({
                    backgroundColor: theme.palette.background.paper,
                    padding: theme.spacing(6),
                    borderRadius: "15px"
                })}
            >
                <header className={kcClsx("kcFormHeaderClass")}>
                    <div
                        className={css({
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: theme.spacing(1)
                        })}
                    >
                        <img src={logoPng} width="300px"></img>
                    </div>

                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <Typography
                                variant="h1"
                                sx={{
                                    pb: 3
                                }}
                            >
                                {headerNode}
                            </Typography>
                        ) : (
                            <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                    <div className="kc-login-tooltip">
                                        <i className={kcClsx("kcResetFlowIcon")}></i>
                                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                    </div>
                                </a>
                            </div>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                        <span className="subtitle">
                                            <span className="required">*</span>
                                            {msg("requiredFields")}
                                        </span>
                                    </div>
                                    <div className="col-md-10">{node}</div>
                                </div>
                            );
                        }

                        return node;
                    })()}
                </header>
                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert
                                variant="outlined"
                                severity={message.type}
                                sx={{
                                    mb: 3,
                                    mt: 3
                                }}
                            >
                                <span
                                    className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </Alert>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <div
                                className={css({
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: theme.spacing(3)
                                })}
                            >
                                {infoNode}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
