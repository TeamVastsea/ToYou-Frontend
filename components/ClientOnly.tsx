import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';
import {Skeleton} from '@nextui-org/react';

const NoSSR = (props: {children: ReactNode|ReactNode[]}) => <React.Fragment>{props.children}</React.Fragment>;

export default dynamic(() => Promise.resolve(NoSSR), {
    ssr: false,
    loading: (props) => {
        return (
            <Skeleton className="flex rounded-lg w-60 h-12"/>
        )
    }
});