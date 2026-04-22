'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Container,
    IconButton,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    getHeaderNavItems,
    getHomeHref,
    getHeaderRole,
    getNotificationsHref,
    getProfileHref,
    isActiveHeaderPath,
} from './model/navigation';

export function Header() {
    const pathname = usePathname();
    const role = getHeaderRole(pathname);
    const navItems = getHeaderNavItems(role);
    const homeHref = getHomeHref(role);
    const profileHref = getProfileHref(role);
    const notificationsHref = getNotificationsHref(role);

    return (
        <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
                backgroundColor: '#fafcfd',
                borderBottom: '1px solid',
                borderColor: '#dfe8ef',
                color: 'text.primary',
                backdropFilter: 'blur(14px)',
            }}
        >
            <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }}>
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: 72,
                        gap: { xs: 1.5, md: 2 },
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography
                        component={Link}
                        href={homeHref}
                        variant="h5"
                        sx={{
                            color: '#2F6F8C',
                            fontSize: { xs: '1.2rem', md: '1.45rem' },
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                    >
                        Мой ИВМиИТ
                    </Typography>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            minWidth: 0,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{
                                alignItems: 'center',
                                overflowX: 'auto',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                            }}
                        >
                            {navItems.map(({ href, label, icon: Icon }) => {
                                const active = isActiveHeaderPath(pathname, href);

                                return (
                                    <Tooltip key={href} title={label}>
                                        <Box
                                            component={Link}
                                            href={href}
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: active ? 0.75 : 0,
                                                width: active ? 'auto' : 40,
                                                minWidth: 40,
                                                height: 40,
                                                borderRadius: 1.5,
                                                backgroundColor: active ? '#c9e7fb' : 'transparent',
                                                color: active ? '#35708A' : 'text.secondary',
                                                px: active ? 1.25 : 0,
                                                transition: 'background-color 150ms ease, color 150ms ease',
                                                whiteSpace: 'nowrap',
                                                '&:hover': {
                                                    backgroundColor: active ? '#bfe1f8' : 'rgba(201, 231, 251, 0.38)',
                                                    color: '#35708A',
                                                },
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 20 }} />
                                            {active ? (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
                                            ) : null}
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} alignItems="center" flexShrink={0}>
                        <Tooltip title="Тема">
                            <IconButton size="small" sx={{ color: '#24324A' }}>
                                <DarkModeOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Уведомления">
                            <IconButton
                                component={Link}
                                href={notificationsHref}
                                size="small"
                                sx={{
                                    color: isActiveHeaderPath(pathname, notificationsHref) ? '#1565c0' : '#24324A',
                                }}
                            >
                                <Badge color="error" variant="dot">
                                    <NotificationsNoneRoundedIcon fontSize="small" />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Профиль">
                            <IconButton component={Link} href={profileHref} sx={{ p: 0 }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: '#24324A',
                                        borderRadius: 1.5,
                                    }}
                                >
                                    <PersonRoundedIcon fontSize="small" />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
