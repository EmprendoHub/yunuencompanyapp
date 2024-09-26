"use client";
import { timelineResourceData } from "@/app/(dashdata)/Calendarsource";
import * as React from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,
  EventRenderedArgs,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense, extend } from "@syncfusion/ej2-base";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import Image from "next/image";
import "./_components/editor-template.css";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cXGNCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXdcc3ZXQmVfWEV+XEY="
);

export default function SchedulePage() {
  const scheduleObj: any = React.useRef<ScheduleComponent>(null);
  const fields = {
    startTime: { name: "StartTime", validation: { required: true } },
    endTime: { name: "EndTime", validation: { required: true } },
  };

  const data: Record<string, any>[] = extend(
    [],
    timelineResourceData as Record<string, any>,
    undefined,
    true
  ) as Record<string, any>[];

  // Tooltip template
  const tooltipTemplate = (props: any) => {
    return (
      <div className="tooltip-wrap">
        <Image
          src={`/icons/${props.EventType + ".png"}`}
          className="image"
          alt="image"
          height={50}
          width={50}
        />
        <div className="content-area">
          <div className="event-name">{props.Subject}</div>
          {props.Location !== null && props.Location !== undefined ? (
            <div className="location">{props.Location}</div>
          ) : (
            ""
          )}
          <div className="time">
            Scheduled&nbsp;:&nbsp;{props.StartTime.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  const onEventRendered = (args: EventRenderedArgs): void => {
    switch (args.data.Location) {
      case "facebook":
        (args.element as HTMLElement).style.backgroundColor = "#4267B2";
        break;
      case "instagram":
        (args.element as HTMLElement).style.backgroundColor = "#C13584";
        break;
      case "tiktok":
        (args.element as HTMLElement).style.backgroundColor = "#000000";
        break;
    }
  };

  const onActionBegin = (args: Record<string, any>): void => {
    if (
      args.requestType === "eventCreate" ||
      args.requestType === "eventChange"
    ) {
      let data: Record<string, any> =
        args.data instanceof Array ? args.data[0] : args.data;
      args.cancel = !scheduleObj.current?.isSlotAvailable(
        data.StartTime as Date,
        data.EndTime as Date
      );
    }
  };

  const editorHeaderTemplate = (props: Record<string, any>) => {
    return (
      <div id="event-header">
        {props !== undefined ? (
          props.Subject ? (
            <div>{props.Subject}</div>
          ) : (
            <div className=" dark:text-white">Crear Nueva Publicación</div>
          )
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const editorTemplate = (props: Record<string, any>) => {
    return props !== undefined ? (
      <table
        className="custom-event-editor dark:text-white"
        style={{ width: "100%" }}
        cellPadding={5}
      >
        <tbody className="bg-background">
          <tr>
            <td className="e-textlabel">Red Social</td>
            <td colSpan={4}>
              <DropDownListComponent
                id="EventType"
                placeholder="Choose status"
                data-name="EventType"
                className="e-field dark:text-white capitalize"
                style={{ width: "100%", color: "white" }}
                dataSource={["facebook", "tiktok", "instagram"]}
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Fecha</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id="StartTime"
                format="dd/MM/yy hh:mm a"
                data-name="StartTime"
                value={new Date(props.startTime || props.StartTime)}
                className="e-field "
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">To</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id="EndTime"
                format="dd/MM/yy hh:mm a"
                data-name="EndTime"
                value={new Date(props.endTime || props.EndTime)}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Reason</td>
            <td colSpan={4}>
              <textarea
                id="Description"
                className="e-field e-input"
                name="Description"
                rows={3}
                cols={50}
                style={{
                  width: "100%",
                  height: "60px !important",
                  resize: "vertical",
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Titulo</td>
            <td colSpan={4}>
              <input
                id="Summary"
                className="e-field e-input"
                type="text"
                name="Subject"
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div></div>
    );
  };

  const [eventSettings, setEventSettings] = React.useState<EventSettingsModel>({
    dataSource: data,
    fields: fields,
    enableTooltip: true,
    tooltipTemplate: tooltipTemplate,
  });

  return (
    <div className="schedule-control-section">
      <div className="col-lg-12 control-section">
        <div className="control-wrapper">
          <ScheduleComponent
            className=" rounded-xl bg-background"
            width="100%"
            height="650px"
            ref={scheduleObj}
            eventSettings={eventSettings}
            editorTemplate={editorTemplate}
            editorHeaderTemplate={editorHeaderTemplate}
            actionBegin={onActionBegin}
            eventRendered={onEventRendered}
            showQuickInfo={false}
          >
            <ViewsDirective>
              <ViewDirective option="Day" />
              <ViewDirective option="Week" />
              <ViewDirective option="Month" />
              <ViewDirective option="Agenda" />
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Agenda]} />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
}
