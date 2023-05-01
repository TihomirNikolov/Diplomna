import { useEffect, useState } from "react";
import { useUser } from "../../contexts";
import { authClient, baseURL } from "../../utilities";

interface LoginInfo {
    id: string,
    token: string,
    deviceType: string
}

export default function AccountPage() {
    const [data, setData] = useState<LoginInfo[]>([])

    useEffect(() => {

        async function fetchData() {
            try {
                var response = await authClient.get(`${baseURL()}api/user/logins`);

                var data = response.data as LoginInfo[];

                setData(data);
            }
            catch (error) {
                setData([]);
            }
        }

        fetchData();
    }, [])

    return (
        <div>
            {data.map((item, i) => {
                return <div>{item.deviceType}</div>
            })}
        </div>
    )
}