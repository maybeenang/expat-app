import {QueryObserverResult} from '@tanstack/react-query';
import {useCallback, useEffect, useState} from 'react';

type Props = {
  refetch: () => Promise<QueryObserverResult<any[], Error>>;
  isFetching?: boolean;
};

const useManualRefresh = ({refetch, isFetching}: Props) => {
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Manual refresh failed:', err);
    } finally {
      setIsManualRefreshing(false);
    }
  }, [refetch]);

  useEffect(() => {
    if (!isFetching) {
      setIsManualRefreshing(false);
    }
  }, [isFetching]);

  return {
    isManualRefreshing,
    handleManualRefresh,
  };
};

export default useManualRefresh;
