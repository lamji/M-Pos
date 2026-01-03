import { Box, Typography, ButtonBase } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

type ButtonCardProps = {
    text: string;
    icon: SvgIconComponent;
    onClick?: () => void;
};

export default function ButtonCard({ text, icon: Icon, onClick }: ButtonCardProps) {
    return (
        <ButtonBase
            onClick={onClick}
            sx={{
                borderRadius: 1,
                overflow: "hidden", // important for ripple effect to stay inside
                display: "inline-block",
            }}
        >
            <Box
                sx={{
                    p: 1,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                    width: 60,
                    height: 60,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                }}
            >
                <Icon
                    sx={{
                        color: "primary.contrastText",
                        fontSize: 24,
                    }}
                />
                <Typography
                    variant="caption"
                    color="primary.contrastText"
                    sx={{ lineHeight: 1, fontSize: '10px' }}
                >
                    {text}
                </Typography>
            </Box>
        </ButtonBase>
    );
}
