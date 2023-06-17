import React, { SetStateAction } from 'react';
import Axios from 'axios';
import { LOADING_TYPE } from 'renderer/v/LogSourceView';
import config from './Config.json';

export const loghub = Axios.create({
  baseURL: config.loghub.endpoint,
});

loghub.defaults.withCredentials = true;

export const garlinc = Axios.create({
  baseURL: config.garlinc.endpoint,
});

garlinc.defaults.withCredentials = true;

export function useLoadIndex(
  refresh: boolean,
  loading: number,
  setLoading: React.Dispatch<SetStateAction<number>>
) {
  const [indexData, setIndexData] = React.useState(null);
  const [orgNames, setOrgNames] = React.useState([]);

  React.useEffect(() => {
    if (loading !== LOADING_TYPE.INDEX) {
      return;
    }

    if (refresh) {
      garlinc
        .post('/index/refresh')
        .then((rep) => {
          setLoading(LOADING_TYPE.IDLE);
          setIndexData(rep.data);
          setOrgNames(rep.data.map((org: any) => org.name));
          return null;
        })
        .catch(() => {});
      return;
    }

    garlinc
      .get('/index')
      .then((rep) => {
        setLoading(LOADING_TYPE.IDLE);
        setIndexData(rep.data);
        setOrgNames(rep.data.map((org: any) => org.name));
        return null;
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // load index before the first time page rendering
  React.useEffect(() => {
    garlinc
      .get('/index')
      .then((rep) => {
        setLoading(LOADING_TYPE.IDLE);
        setIndexData(rep.data);
        setOrgNames(rep.data.map((org: any) => org.name));
        return null;
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [indexData, orgNames];
}

export function useLoadDetails(
  orgName: string,
  spaceName: string,
  serviceName: string,
  loading: number,
  setLoading: React.Dispatch<SetStateAction<number>>
) {
  const [details, setDetails] = React.useState(null);

  React.useMemo(async () => {
    if (loading !== LOADING_TYPE.DETAILS) {
      return;
    }
    garlinc
      .get(
        `/service?orgName=${orgName}&spaceName=${spaceName}&serviceName=${serviceName}`
      )
      .then((rep) => {
        setLoading(LOADING_TYPE.IDLE);
        setDetails(rep.data);
        return null;
      })
      .catch(() => {
        setLoading(LOADING_TYPE.IDLE);
        setDetails(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgName, spaceName, serviceName, loading]);

  return [details];
}
