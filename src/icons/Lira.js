import SvgIcon from '@material-ui/core/SvgIcon';
import currencyLira from '@iconify/icons-carbon/currency-lira';
import { Icon } from '@iconify/react';
export default function Lira(props) {
    return (
        <SvgIcon {...props} >
            <Icon icon={currencyLira} />
        </SvgIcon>
    );
}

// import { Icon, InlineIcon } from '@iconify/react';
// import currencyLira from '@iconify/icons-carbon/currency-lira';
