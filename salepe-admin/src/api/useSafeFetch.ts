import { useEffect, useState, type DependencyList } from 'react';
import axios from 'axios';

export type FetchStatus = 'loading' | 'ready' | 'missing' | 'error';

interface SafeFetchResult<T> {
  data: T | null;
  status: FetchStatus;
}

// Payment/shipment records may not exist yet (consumer hasn't processed the
// Kafka event, or processing failed) — treat 404 as "not available yet"
// rather than a hard error.
export function useSafeFetch<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList
): SafeFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<FetchStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setStatus('ready');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setStatus('missing');
        } else {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, status };
}
