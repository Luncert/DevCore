/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { useLoadDetails, useLoadIndex } from 'renderer/api/Axios';
import { conditionalString, names } from 'renderer/c/utils';
import LogSourceDetails from './LogSourceDetails';
import LogSourceSpaces from './LogSourceSpaces';
import './LogSourceView.scss';

export const LOADING_TYPE = {
  IDLE: 0,
  INDEX: 1,
  DETAILS: 2,
};

export default function LogSourceView() {
  const [loading, setLoading] = useState(0);
  const [selectedOrgIdx, setSelectedOrgIdx] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [serviceName, setServiceName] = useState('');

  const [indexData, orgNames] = useLoadIndex(true, loading, setLoading);
  const [details] = useLoadDetails(
    orgName,
    spaceName,
    serviceName,
    loading,
    setLoading
  );

  return (
    <div id="LogSourceView">
      <div className="viewHeader">
        <div className="orgTabs">
          {orgNames.map((v, idx) => (
            <div
              key={idx}
              className={names(
                'org',
                conditionalString(idx === selectedOrgIdx, 'selected')
              )}
              onClick={() => setSelectedOrgIdx(idx)}
            >
              <svg
                className="tabLeftRadius"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
              >
                <path
                  fill={
                    idx === selectedOrgIdx
                      ? 'rgb(89, 105, 173)'
                      : 'rgb(58, 67, 87)'
                  }
                  strokeWidth="1"
                  d="M0,8A8,8,0,0,0,8,0L8,8Z"
                />
              </svg>
              <div className="tabInner">{v}</div>
              <svg
                className="tabRightRadius"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
              >
                <path
                  fill={
                    idx === selectedOrgIdx
                      ? 'rgb(89, 105, 173)'
                      : 'rgb(58, 67, 87)'
                  }
                  strokeWidth="1"
                  d="M0,0A8,8,0,0,0,8,8L0,8Z"
                />
              </svg>
            </div>
          ))}
        </div>
        <div className="optionBar">
          <button
            className="refreshBtn btnBase iconfont iconRefresh"
            onClick={() => {
              if (loading === LOADING_TYPE.IDLE) {
                setLoading(LOADING_TYPE.INDEX);
              }
            }}
          />
        </div>
      </div>
      <div className="content">
        <LogSourceSpaces
          orgNames={orgNames}
          selectedOrgIdx={selectedOrgIdx}
          indexData={indexData}
          setServiceLoadingParams={(org, space, service) => {
            if (loading === LOADING_TYPE.IDLE) {
              setLoading(LOADING_TYPE.DETAILS);
              setOrgName(org);
              setSpaceName(space);
              setServiceName(service);
            }
          }}
        />
        <LogSourceDetails
          loading={loading}
          details={details}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
