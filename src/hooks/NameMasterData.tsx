import { getMasterDataByTypeUtil } from '@/utils';
import { Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';

type NameMasterDataProps = {
  type: string;
  value: any;
};
const NameMasterData = (props: NameMasterDataProps) => {
  const { type, value } = props;
  const [masterData, setMasterData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getMasterData = useCallback(async () => {
    setLoading(true);
    const res = await getMasterDataByTypeUtil(type, false, true);
    setLoading(false);
    setMasterData(res);
  }, [type]);

  useEffect(() => {
    if (!value) return;
    getMasterData();
  }, [type, value]);

  return (
    <>
      {value === undefined && ''}
      {loading && <Spin size="small" />}
      {(!loading &&
        value !== undefined &&
        masterData.filter((data) => data.code === value)?.[0]?.name) ||
        `[${value}]`}
    </>
  );
};

export default NameMasterData;
