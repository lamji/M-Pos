import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LogoutIcon from '@mui/icons-material/Logout';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export const useViewModel = () => {
    /**
     * Text Content for Homepage V2
     */
    const text = {
        title: "M-POS V2",
    };

    /**
     * Button Configurations for Homepage V2
     */
    const buttons = [
        {
            title: "POS",
            icon: PointOfSaleIcon,
            onClick: () => {
                console.log("POS clicked");
            },
        },
        {
            title: "Add",
            icon: AddIcon,
            onClick: () => {
                console.log("Add clicked");
            },
        },
        {
            title: "Products",
            icon: ProductionQuantityLimitsIcon,
            onClick: () => {
                console.log("Remove clicked");
            },
        },
        {
            title: "Remove",
            icon: RemoveIcon,
            onClick: () => {
                console.log("Remove clicked");
            },
        },
        {
            title: "G-List",
            icon: FormatListNumberedIcon,
            onClick: () => {
                console.log("G-List clicked");
            },
        },
        {
            title: "Logout",
            icon: LogoutIcon,
            onClick: () => {
                console.log("Logout clicked");
            },
        },
    ];

    return {
        text,
        buttons,
    };
};
