/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

const nameCompartor = (a: any, b: any) => (a.name > b.name ? 1 : -1);

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

interface LogSourceSpacesProps {
  orgNames: string[];
  selectedOrgIdx: number;
  indexData: Organization[];
  setServiceLoadingParams: (
    orgName: string,
    spaceName: string,
    serviceName: string
  ) => void;
}

export default function LogSourceSpaces({
  orgNames,
  selectedOrgIdx,
  indexData,
  setServiceLoadingParams,
}: LogSourceSpacesProps) {
  if (!indexData || indexData.length === 0) {
    return React.createElement('span');
  }

  const spaces = [];
  const spaceData = indexData[selectedOrgIdx].spaces.sort(nameCompartor);
  for (let i = 0; i < spaceData.length; i++) {
    const space = spaceData[i];
    const dwcManaged = [];
    const notDwcManaged = [];
    const serviceData = space.services.sort(nameCompartor);
    for (let j = 0; j < serviceData.length; j++) {
      const service = serviceData[j];
      const elem = (
        <div
          key={service.name}
          className="service"
          onClick={() =>
            setServiceLoadingParams(
              orgNames[selectedOrgIdx],
              space.name,
              service.name
            )
          }
        >
          {renderServiceName(service.name, true)}
        </div>
      );
      if (service.dwcManaged) {
        dwcManaged.push(elem);
      } else {
        notDwcManaged.push(elem);
      }
    }
    spaces.push(
      <div key={space.name} className="space">
        <span className="spaceName">{space.name}</span>
        <div className="serviceContainerWrapper">
          <div className="serviceContainer">{dwcManaged}</div>
          <div className="serviceContainer">{notDwcManaged}</div>
        </div>
      </div>
    );
  }

  return <div className="spaceContainer">{spaces}</div>;
}
