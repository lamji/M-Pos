import { useDeviceType } from "@/src/common/helpers";
import Layout from "@/src/components/Layout";
import LaptopScanItems from "@/src/components/Laptop/Pos";
import ScanItems from "@/src/components/Mobile/ScanItems";

export default function HomeV1() {
    const { isMobile } = useDeviceType();

    const Content = isMobile ? ScanItems : LaptopScanItems;

    return (
        <Layout header="POS">
            <Content />
        </Layout>
    );
}
