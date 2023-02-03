import Spin from "./spin";

const SpinUntilLoad = ({isLoading, children}) => {
    return isLoading ? <Spin /> : children;

}

export default SpinUntilLoad