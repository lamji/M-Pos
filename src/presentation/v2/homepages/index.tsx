import { useDeviceType } from "@/src/common/helpers";
import HomeMobileV2 from "./mobile";
import HomeDefaultV2 from "./default";
import Layout from "@/src/components/Layout";

export default function HomeV2() {
    const { isMobile } = useDeviceType();

    const Content = isMobile ? HomeMobileV2 : HomeDefaultV2;
    return (
        <Layout header="POS" showNav={false}>
            <Content />
        </Layout>
    )
}