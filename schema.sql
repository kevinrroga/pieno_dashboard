-- ============================================================
-- Pieno Dashboard — Database Schema
-- ============================================================

-- Types
CREATE TYPE employee_role AS ENUM ('cook', 'waiter');
CREATE TYPE shift_status  AS ENUM ('scheduled', 'cancelled');

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE employees (
  id          SERIAL PRIMARY KEY,
  name        TEXT           NOT NULL,
  role        employee_role  NOT NULL,
  hourly_rate NUMERIC(8, 2)  NOT NULL CHECK (hourly_rate > 0),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE shifts (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER        NOT NULL REFERENCES employees(id),
  shift_date  DATE           NOT NULL,
  start_time  TIME           NOT NULL,
  end_time    TIME           NOT NULL,
  total_hours NUMERIC(5, 2)  NOT NULL CHECK (total_hours > 0),
  status      shift_status   NOT NULL DEFAULT 'scheduled',
  notes       TEXT,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  CONSTRAINT end_after_start CHECK (end_time > start_time)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_shifts_employee_id ON shifts(employee_id);
CREATE INDEX idx_shifts_shift_date  ON shifts(shift_date);
CREATE INDEX idx_shifts_status      ON shifts(status);
-- Composite index for the most common query: weekly schedule by date + status
CREATE INDEX idx_shifts_date_status ON shifts(shift_date, status);

-- ============================================================
-- Seed Data
-- ============================================================

INSERT INTO employees (name, role, hourly_rate) VALUES
  ('Marco Rossi',    'cook',   18.50),
  ('Giulia Ferri',   'cook',   17.00),
  ('Luca Esposito',  'waiter', 13.00),
  ('Sofia Marino',   'waiter', 13.50),
  ('Elena Conti',    'waiter', 12.50);

-- Shifts: two weeks around 2026-03-23 → 2026-04-05
-- total_hours = EXTRACT(EPOCH FROM (end_time - start_time)) / 3600

INSERT INTO shifts (employee_id, shift_date, start_time, end_time, total_hours, status, notes) VALUES
  -- Week 1: Mar 23–29
  (1, '2026-03-23', '08:00', '16:00', 8.00, 'scheduled', NULL),
  (2, '2026-03-23', '09:00', '17:00', 8.00, 'scheduled', NULL),
  (3, '2026-03-23', '11:00', '19:00', 8.00, 'scheduled', NULL),
  (4, '2026-03-24', '10:00', '15:00', 5.00, 'scheduled', NULL),
  (5, '2026-03-24', '10:00', '14:00', 4.00, 'scheduled', NULL),
  (1, '2026-03-25', '08:00', '14:00', 6.00, 'scheduled', NULL),
  (3, '2026-03-25', '12:00', '20:00', 8.00, 'scheduled', NULL),
  (2, '2026-03-26', '09:00', '17:00', 8.00, 'cancelled', 'Called in sick'),
  (4, '2026-03-27', '11:00', '19:00', 8.00, 'scheduled', NULL),
  (5, '2026-03-28', '10:00', '16:00', 6.00, 'scheduled', NULL),

  -- Week 2: Mar 30–Apr 5
  (1, '2026-03-30', '08:00', '16:00', 8.00, 'scheduled', NULL),
  (2, '2026-03-31', '09:00', '17:00', 8.00, 'scheduled', NULL),
  (3, '2026-04-01', '11:00', '19:00', 8.00, 'scheduled', NULL),
  (4, '2026-04-02', '10:00', '15:00', 5.00, 'cancelled', 'Public holiday coverage not needed'),
  (5, '2026-04-03', '10:00', '18:00', 8.00, 'scheduled', NULL);
