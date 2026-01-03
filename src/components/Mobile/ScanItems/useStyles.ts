export const useScanItemsStyles = () => {
    return {
        fabBox: {
            width: "70%",
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            zIndex: 1300,
        },
        fab: {
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
        },
        emptyListItems: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            height: "80vh"
        },
        boxItems: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '98%',
            margin: '0 auto',
            background: '#f7f7f7',
            padding: '5px',
            mb: '3px',
            borderRadius: '10px',
        },
        listWrapper: {

            height: '90vh',
            overflow: 'scroll',
            padding: '30px 20px'
        },
        boxList: {
            background: 'white', borderRadius: '50px 50px 0 0'
        },
        itemQuantity: {
            color: "gray",
            fontSize: "10px"
        }
    }
}