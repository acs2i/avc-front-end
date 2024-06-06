import React, { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import CustomToolbar from "./CalendarToolbar";
import Modal from "../Shared/Modal";

const locales = { fr: fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Event = {
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
};

const initialEvents: Event[] = [
  {
    title: "Grande Réunion",
    allDay: true,
    start: new Date(2024, 6, 1),
    end: new Date(2024, 6, 1),
  },
];

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: new Date(),
    end: new Date(),
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: name === "title" ? value : parse(value, "yyyy-MM-dd", new Date()),
    }));
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("addEvent function called");
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      },
    ]);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
    });
    setIsModalOpen(false);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({ title: "", start, end });
    setIsModalOpen(true);
  };

  return (
    <>
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addEvent}
        header="Créer un événement"
        icon="E"
      >
        <div  className="w-full flex justify-center">
          <input
            type="text"
            name="title"
            placeholder="Nom de l'événement"
            value={newEvent.title}
            onChange={handleInputChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="date"
            name="start"
            value={format(newEvent.start, "yyyy-MM-dd")}
            onChange={handleInputChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="date"
            name="end"
            value={format(newEvent.end, "yyyy-MM-dd")}
            onChange={handleInputChange}
            className="mr-2 p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Ajouter l'événement
          </button>
        </div>
      </Modal>

      <div>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: 500 }}
          culture="fr"
          components={{ toolbar: CustomToolbar }}
        />
      </div>
    </>
  );
};

export default Calendar;
