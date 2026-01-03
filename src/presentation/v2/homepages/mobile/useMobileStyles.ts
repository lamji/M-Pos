

export const useMobileStyles = () => {
    return {
        container: {
            borderRadius: '8px',
            fontSize: '20px',
            backgroundColor: 'primary.light',
            padding: '16px',
            height: "200px",
            color: '#ffffffff',
        },
        text: {
            fontWeight: "bold"
        },
        subtext: {
            fontSize: '12px',
            color: '#ffffffff',
        },
        quickActions: {
            fontSize: "14px",
            fontWeight: "bold",
            mt: 3,
        },
        header: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
        },
        button: {
            width: '100%',
            padding: '12px',
            fontSize: '18px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        },
        monthlySalesStyles: {
            display: "flex",
            alignItems: "center",
            marginTop: "16px",
            justifyContent: "space-between",
        },
        innerMonthlySalesStyles: {
            border: "solid 1px #ffffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            padding: "8px",
            borderRadius: "5px",
            marginTop: "50px",
            backgroundColor: "primary.main"
        },
        innerMonthlyTextStyles: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#ffffffff"
        },
        iconStyles: {
            position: "absolute",
            top: "50%",
            right: "-100px", // adjust as needed
            transform: "translateY(-50%)",
            fontSize: 450, // big background size
            color: "rgba(255, 255, 255, 0.54)", // faint color for background effect
        },
        headerMonthlySalesStyles: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
    };
}