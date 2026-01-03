import { Box, Button, Typography } from "@mui/material";
import { useViewModel } from "../useViewModel";
import { useMobileStyles } from "./useMobileStyles";
import ButtonCard from "@/src/components/V2/ButtonCard";
import CallMergeIcon from '@mui/icons-material/CallMerge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HomeMobileV2() {
    const model = useViewModel();
    const styles = useMobileStyles();

    return (
        <Box>
            <Typography variant="h6" sx={styles.header}>
                {model.text.title}
            </Typography>

            <Box sx={{ ...styles.container, position: "relative", overflow: "hidden" }}>
                <CallMergeIcon sx={styles.iconStyles} />
                <Box sx={styles.headerMonthlySalesStyles}>
                    <Box>
                        <Typography sx={styles.text} variant="h5">10,250</Typography>
                        <Typography sx={styles.subtext} variant="body1">Total Sales Today</Typography>
                    </Box>
                    <Button endIcon={<ArrowForwardIcon sx={{ color: "#ffffffff" }} />} variant="text" sx={{ textTransform: "none", p: 0, color: "#ffffffff" }}>
                        More
                    </Button>
                </Box>

                <Box sx={styles.monthlySalesStyles}>
                    <Box sx={styles.innerMonthlySalesStyles}>
                        <Typography sx={styles.innerMonthlyTextStyles} variant="body1">3,000</Typography>
                        <Typography sx={styles.subtext} variant="body1">Month of July</Typography>
                    </Box>
                    <Box sx={styles.innerMonthlySalesStyles}>
                        <Typography sx={styles.innerMonthlyTextStyles} variant="body1">3,000</Typography>
                        <Typography sx={styles.subtext} variant="body1">Month of Aug</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Product info */}
            <Typography variant="h6" sx={styles.quickActions}>
                Product Info
            </Typography>

            {/* Quick Actions */}
            <Typography variant="h6" sx={styles.quickActions}>
                Quick Actions
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)", // 👈 4 buttons per row
                    gap: 1.5,
                    mt: 2,
                }}
            >
                {model.buttons.map((button, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: "center" }}>
                        <ButtonCard
                            text={button.title}
                            icon={button.icon}
                            onClick={button.onClick}
                        />
                    </Box>
                ))}
            </Box>

        </Box>
    );
}
