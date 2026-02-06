<?php
/**
 * KI-AKADEMIE - Konfigurationsdatei
 * Enthält Passwort und Seiteneinstellungen
 */

return [
    // Dozenten-Passwort (Klartext - wird serverseitig geprüft)
    'password' => 'dozent2026',

    // Seiteneinstellungen (editierbar über den Dozenten-Editor)
    'site' => [
        'title'       => 'KI-GRUNDLAGEN',
        'subtitle'    => 'Wirtschaftsschule Five',
        'course_name' => 'KI-Grundlagen',
        'course_badge' => 'Einführungsmodul',
        'course_desc' => 'für Büro-, Marketing- und Verkaufsleiter',
        'dozent'      => 'Michael Rueetschli',
        'institution' => 'Wirtschaftsschule Five',
        'stat_modules'  => '6',
        'stat_exercises' => '12+',
        'stat_duration'  => '6h',
    ],
];
