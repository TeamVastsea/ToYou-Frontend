import {IoCheckmark, IoCloseSharp} from "react-icons/io5";

const PasswordRobustnessList = (props: { active: boolean[] }) => {
    const labels = [
        {
            key: 'min',
            label: '至少8位',
            defaultShow: true
        },
        {
            key: 'fuck',
            label: '大写字母、小写字母、数字、特殊符号中至少包含两种',
            defaultShow: true
        },
        {
            key: 'max',
            label: '至多30位',
            defaultShow: false
        }
    ]
    return (
        <ul className="w-full">
            {
                labels.map(({label, key, defaultShow}, idx) => {
                    let show = defaultShow;
                    if (idx === labels.length - 1) {
                        show = !props.active[idx];
                    }
                    return show && (
                        <li
                            key={key}
                            className={`
                                    flex items-center transition
                                    ${props.active[idx] ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`
                            }
                        >
                            {
                                props.active[idx] ? <IoCheckmark className="inline text-xl"/> :
                                    <IoCloseSharp className="inline text-xl"/>
                            }
                            <span>{label}</span>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default PasswordRobustnessList
