/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { SetStateAction } from 'react';
import './LogSourceView.scss';
import {
  buildLogSourceId,
  compareDateString,
  conditionalString,
  names,
  parseDateStringToText,
} from 'renderer/c/utils';
import { LOADING_TYPE } from './LogSourceView';
import { Panel, usePanelManager } from './PanelManager';
import SidebarItem from './SidebarItem';
import LogStreamingView from './LogStreamingView';

function copyInfo(name: string, value: string) {
  return navigator.clipboard.writeText(value).then(() => {
    console.log(`${name} copied to clipboard`);
    return null;
  });
}

function renderServiceName(name: string, singleLine: boolean) {
  const groups = name.match(/^(.*)-([a-z0-9]{8}(-[a-z0-9]+){4})$/);
  if (groups == null) {
    return name;
  }

  return [
    groups[1],
    singleLine ? null : <br key="newline" />,
    <span
      key="id"
      style={{
        fontStyle: 'italic',
        fontWeight: 'normal',
        color: 'rgb(160, 160, 160)',
      }}
    >
      -{groups[2]}
    </span>,
  ];
}

interface LogSourceDetailsProps {
  loading: number;
  details: any;
  setLoading: React.Dispatch<SetStateAction<number>>;
}

export default function LogSourceDetails({
  loading,
  details,
  setLoading,
}: LogSourceDetailsProps) {
  const panelManager = usePanelManager();

  if (loading) {
    return (
      <div className="serviceDetails">
        <div className="ringLoader">
          <div className="ringLoaderInner"></div>
        </div>
      </div>
    );
  }
  if (!details) {
    return (
      <div className="serviceDetails">
        <div className="noContent"></div>
      </div>
    );
  }

  const sortedApps = details.applications
    .filter((v: any) => v.artifactCreatedAt !== undefined)
    .sort(
      (a: any, b: any) =>
        -compareDateString(a.artifactCreatedAt, b.artifactCreatedAt)
    );
  const latestAppId = sortedApps.length > 0 ? sortedApps[0].appId : undefined;

  return (
    <div className="serviceDetails">
      <div className="header">
        <div className="serviceName">
          {renderServiceName(details.name, false)}
        </div>
        <div className="serviceOptionBar">
          {details.dwcManaged ? (
            <span className="dwcManaged label">DWC Managed</span>
          ) : (
            <span className="cfManaged label">Cloud Foundry Managed</span>
          )}
          {details.artifactResource && (
            <button
              className="githubBtn btnBase iconfont iconGithub"
              onClick={() =>
                window.open(
                  `https://${details.artifactResource.replace('/master', '')}`
                )
              }
            />
          )}
          <button
            className="refreshBtn btnBase iconfont iconRefresh"
            onClick={() => {
              if (loading === LOADING_TYPE.IDLE) {
                setLoading(LOADING_TYPE.DETAILS);
              }
            }}
          />
        </div>
      </div>
      <div className="applications">
        {details.applications.map((app: any) => (
          <div
            key={app.appId}
            className={names(
              'application',
              conditionalString(app.appId === latestAppId, ' latest')
            )}
          >
            <div className="field applicationName">
              <button
                className="copyBtn btnBase iconfont iconCopy"
                onClick={() => copyInfo('application name', app.name)}
              />
            </div>
            <div className="field cfCockpitLink">
              <button
                className="cloudBtn btnBase iconfont iconCloud"
                onClick={() => window.open(app.cfCockpitLink)}
              />
            </div>
            <div className="field applicationId">
              <span>{app.appId}</span>
              <button
                className="copyBtn btnBase iconfont iconCopy"
                onClick={() => copyInfo('application id', app.appId)}
              />
            </div>
            {details.dwcManaged && (
              <div className="field deploymentId">
                <span>{app.deploymentId}</span>
                <button
                  className="copyBtn btnBase iconfont iconCopy"
                  onClick={() => copyInfo('deployment id', app.deploymentId)}
                />
              </div>
            )}
            <div className="field applicationCreatedAt">
              {parseDateStringToText(app.applicationCreatedAt)}
            </div>
            <div className="field artifactCreatedAt">
              {parseDateStringToText(app.artifactCreatedAt)}
            </div>
            <div className="instances">
              {app.instances.map((instance: any) => (
                <div key={instance.instanceId} className="instance">
                  <span className="instanceId">{instance.instanceId}</span>

                  {(app.loghubIntegrated || true) && (
                    <button
                      className="consoleBtn btnBase iconfont iconConsole"
                      onClick={() => {
                        const logSourceId = buildLogSourceId(
                          app.appId,
                          instance.instanceId
                        );
                        const sidebarItemId = `SidebarItem/LogStream/${logSourceId}`;
                        const panelId = `LogStreamingView/LogStream/${logSourceId}`;
                        panelManager.createPanel(
                          <SidebarItem
                            key={sidebarItemId}
                            name={sidebarItemId}
                            iconName="iconConsole"
                            bindPanel={panelId}
                          />,
                          <Panel
                            key={panelId}
                            name={panelId}
                            element={
                              <LogStreamingView
                                serviceName={app.name}
                                logSourceId={logSourceId}
                              />
                            }
                          />,
                          true
                        );
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
