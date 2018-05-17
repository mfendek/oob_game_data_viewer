<?php

try {
    $startTime = microtime(true);

    error_reporting(-1);
    ini_set('error_log', 'logs/oobgdw-error-' . strftime('%Y%m%d') . '.log');

    $version = '2018-05-17';

    // configuration

    $validFilters = [
        'id',
        'name',
        'category',
        'type',
        'chassis',
        'faction',
        'available',
        'trait',
        'switch',
    ];

    // number of items per one page
    $itemsPerPage = 10;

    // unit action image name correction
    $actionImgTrans = [
        'weapon' => 'weapon_switch',
        'rail' => 'railmode',
        'road' => 'roadmode',
        'anti_air' => 'aa_switch',
        'anti_tank' => 'at_switch',
        'artillery' => 'art_switch',
        'bomb' => 'bomb_switch',
    ];

    $actionImagesWithInnerImage = [
        'weapon',
    ];

    // hard coded trait mapping T_T
    $traitTrans = [
        'marines' => 'Marines',
        'submerged' => 'Submergable',
        'camouflaged' => 'Camouflaged',
        'airborne' => 'Airborne',
        'strategicAttack' => 'Razer',
        'explosives' => 'Demolitions',
        'bridgeBuilder' => 'Bridge Builder',
        'weakFlanks' => 'Weak Flanks',
        'tunneling' => 'Tunnelling',
        'concealable' => 'Concealable',
        'minesweeper' => 'Mine Sweeper',
        'minelayer' => 'Mine Layer',
        'kamikaze' => 'Kamikaze',
        'singleShot' => 'Single Shot',
        'armouredCargo' => 'Armoured Cargo',
        'noSupply' => 'Supply Immune',
        'torpedo' => 'Torpedo-Armed',
        'entrenchSupport' => 'Digger',
        'lightTreaded' => 'Light Tread',
        'highRiskReturn' => 'High Risk/Return',
        'guerrilla' => 'Guerrilla',
        'quickRetreat' => 'Quick Retreat',
        'firstStrike' => 'First Strike',
        'unreliable' => 'Unreliable',
        'specOps' => 'Special Ops',
        'healer' => 'Healer',
        'sonar' => 'Sonar',
        'swimmer' => 'Swimmer',
        'AAFire' => 'AA Batteries',
        'torpedoImmune' => 'Planing Hull',
        'defensive' => 'Defensive Weapon',
        'dogfighter' => 'Dogfighter',
        'interceptor' => 'Interceptor',
        'groundAttack' => 'Ground-Attack',
        'nightFighter' => 'Night Attacker',
        'hexRepairer' => 'Infrastructural Repairs',
        'heavyTreaded' => 'Heavy Treading',
        'quickEntrench' => 'Quick Entrenchment',
        'limitlessFuel' => 'Limitess Fuel',
        'carrierPlane' => 'Carrier Plane',
        'noEntrench' => 'No Entrenchment',
        'noCapture' => 'Fleeting Presence',
        'lightFreight' => 'Light Freight',
        'airCarrier' => 'Aircraft Carrier',
        'precisionStrike' => 'Precision Strike',
        'floatPlane' => 'Seaplane',
        'hardToHit' => 'Difficult Target',
        'slowRepair' => 'Limited Replacements',
        'supplyResilient' => 'Supply Resilient',
    ];

    $customTraits = [
        'Rapid Deployment' => 'Unit can fire after moving',
    ];

    // processing

    // determine base url
    $baseUrl = (!empty($_SERVER['REQUEST_URI'])) ? $_SERVER['REQUEST_URI'] : '';
    if (strpos($baseUrl, '?') !== false) {
        $baseUrl = explode('?', $baseUrl);
        $baseUrl = $baseUrl[0];
    }

    // process preselected filters
    $selectedFilters = [];
    if (array_key_exists('f', $_GET)) {
        $filters = json_decode($_GET['f'], true);
        if (!is_null($filters)) {
            foreach ($filters as $name => $value) {
                if (in_array($name, $validFilters) && mb_strlen($value) < 500) {
                    $selectedFilters[$name] = $value;
                }
            }
        }
    }

    // process unit type specific traits
    $dataFile = file_get_contents('src/game_data/Data/classes.txt');
    if ($dataFile === false) {
        throw new Exception('Failed to open classes data file');
    }

    $dataFile = explode("\n", $dataFile);
    $currentId = '';
    $typeTraits = [];
    foreach ($dataFile as $line) {
        if (strpos($line, '[') !== false) {
            // retrieve item name
            $itemId = str_replace(['[', ']'], ['', ''], $line);
            $itemId = strtolower($itemId);
            $itemId = trim($itemId);
            $currentId = $itemId;
        } elseif (strpos($line, '=') === false && $currentId != '' && !empty(trim($line))) {
            $line = trim($line);
            if (array_key_exists($currentId, $typeTraits)) {
                $typeTraits[$currentId][] = $line;
            } else {
                $typeTraits[$currentId] = [$line];
            }
        }
    }

    // process terrain
    $terrain = [];
    $roadFactor = [];
    $climates = [
        'dry' => '',
        'wet' => '_wet',
        'winter' => '_winter',
        'arid' => '_arid',
    ];

    // process chassis (CSV file not in use yet)
//    foreach ($climates as $climate => $climateId) {
//        $dataFile = file_get_contents('src/game_data/Data/chassis' . $climateId . '.csv');
//        if ($dataFile === false) {
//            throw new Exception('Failed to open chassis data file');
//        }
//
//        $dataFile = explode("\n", $dataFile);
//        foreach ($dataFile as $lineNumber => $line) {
//            $line = explode(";", $line);
//            $name = trim($line[0]);
//
//            // skip heading line and empty lines
//            if (empty($name) || $lineNumber === 0) {
//                continue;
//            }
//
//            $name = strtolower($name);
//            $fields = [
//                'open' => 2,
//                'farmland' => 3,
//                'jungle' => 4,
//                'beach' => 5,
//                'desert' => 6,
//                'rough_desert' => 7,
//                'hills' => 8,
//                'mountains' => 9,
//                'swamp' => 10,
//                'rice' => 11,
//                'city' => 12,
//                'village' => 13,
//                'japanese_village' => 14,
//                'euro_village' => 15,
//                'desert_village' => 16,
//                'town' => 17,
//                'asian_town' => 18,
//                'desert_town' => 19,
//                'airfield' => 20,
//                'forest' => 21,
//                'pine_forest' => 22,
//                'scorched' => 23,
//                'escarpment' => 24,
//                'lake' => 25,
//                'water' => 26,
//                'deep_water' => 27,
//                'cliffs' => 28,
//                'port' => 29,
//            ];
//
//            foreach ($fields as $terrainName => $fieldIndex) {
//                $terrain[$climate][$terrainName]['movement'][$name]['points'] = (int) $line[$fieldIndex];
//            }
//
//            // extract road factor value
//            $factors = [
//                'road_factor_dirt' => $line[30],
//                'road_factor_normal' => $line[31]
//            ];
//
//            foreach ($factors as $factorName => $factor) {
//                if (strpos($factor, ', ') !== false) {
//                    $factor = explode(', ', $factor);
//                    $roadFactor[$climate][$name][$factorName] = (float) $factor[1];
//                }
//            }
//        }
//    }

    // process chassis
    foreach ($climates as $climate => $climateId) {
        $dataFile = file_get_contents('src/game_data/Data/chassis' . $climateId . '.txt');
        if ($dataFile === false) {
            throw new Exception('Failed to open chassis data file');
        }

        $dataFile = explode("\n", $dataFile);
        $currentId = '';
        foreach ($dataFile as $line) {
            if (strpos($line, '[') !== false) {
                // retrieve item name
                $itemId = str_replace(['[', ']'], ['', ''], $line);
                $itemId = strtolower($itemId);
                $itemId = trim($itemId);
                $currentId = $itemId;
            } elseif (strpos($line, '=') !== false && $currentId != '') {
                $line = explode(' = ', $line);
                $name = $line[0];
                $value = $line[1];

                // omit ids (we match by name)
                if ($name == 'id') {
                    continue;
                }

                // process road factor
                if ($name == 'road_factor') {
                    $value = explode(' ', $value);
                    $name.= ($value[0] == '0') ? '_dirt' : '_normal';
                    $value = (float) $value[1];

                    $roadFactor[$climate][$currentId][$name] = $value;
                } else {
                    $terrain[$climate][$name]['movement'][$currentId] = [
                        'points' => (int) $value,
                    ];
                }
            }
        }
    }

    // add road factor to terrain
    foreach ($terrain as $climate => $climateData) {
        foreach($climateData as $terrainName => $terrainData) {
            $terrainData = $terrainData['movement'];

            foreach ($terrainData as $itemId => $chassisData) {
                if (!empty($roadFactor[$climate][$itemId])) {
                    $terrain[$climate][$terrainName]['movement'][$itemId] = $chassisData + $roadFactor[$climate][$itemId];
                }
            }
        }
    }
    unset($roadFactor);

    // process spotting
    foreach ($climates as $climate => $climateId) {
        $dataFile = file_get_contents('src/game_data/Data/terrain' . $climateId . '.csv');
        if ($dataFile === false) {
            throw new Exception('Failed to open terrain data file');
        }

        $dataFile = explode("\n", $dataFile);
        foreach ($dataFile as $line) {
            $line = explode(";", $line);
            $name = $line[0];

            // skip heading line and empty lines
            if (empty($name) || $name === 'name') {
                continue;
            }

            $name = strtolower($name);
            $terrain[$climate][$name]['spotting']['land'] = (int) $line[10];
            $terrain[$climate][$name]['spotting']['naval'] = (int) $line[11];
            $terrain[$climate][$name]['spotting']['air'] = (int) $line[12];
        }
    }

    // process unit names localisation
    $localisationFiles = scandir('src/game_data/Language');
    $unitNamesLocalised = [];
    $traitsLocalisedData = [];
    $nextTraitIdTitle = 1;
    $nextTraitIdDesc = 1;
    foreach ($localisationFiles as $fileName) {
        if (strpos($fileName, 'english') === 0) {
            $dataFile = file_get_contents('src/game_data/Language/' . $fileName);
            if ($dataFile === false) {
                throw new Exception('Failed to open localisation data file ' . $fileName);
            }

            $dataFile = explode("\n", $dataFile);
            foreach ($dataFile as $line) {
                // detect unit name
                if (strpos($line, 'unit_') === 0) {
                    $line = explode(' = ', $line);
                    $unitId = str_replace('unit_', '', $line[0]);
                    if (filter_var($unitId, FILTER_VALIDATE_INT) === false) {
                        continue;
                    }

                    $unitId = (int) $unitId;
                    $unitName = $line[1];
                    $unitNamesLocalised[$unitId] = $unitName;
                } elseif (
                    strpos($line, 'trait_') === 0
                    && (strpos($line, 'title') !== false || strpos($line, 'descr') !== false)
                ) {
                    $line = explode(' = ', $line);
                    $value = trim($line[1]);
                    $line = explode('_', $line[0]);
                    $type = ($line[2] == 'title') ? 'title' : 'desc';

                    // provided ids seem to have conflicts, create new set of ids that are unique
                    // this isn't an issue because we don't have the id mapping to traits anyway
                    $traitId = (int) $line[1];
                    if (!empty($traitsLocalisedData[$traitId][$type])) {
                        $newTraitId = ($type == 'title') ? $nextTraitIdTitle : $nextTraitIdDesc;
                        $traitsLocalisedData[$traitId . '-' . $newTraitId][$type] = $value;

                        if ($type == 'title') {
                            $nextTraitIdTitle+= 1;
                        } else {
                            $nextTraitIdDesc+= 1;
                        }
                    } else {
                        $traitsLocalisedData[$traitId][$type] = $value;
                    }
                }
            }
        }
    }

    $traitsLocalised = [];
    foreach ($traitsLocalisedData as $item) {
        $traitsLocalised[$item['title']] = $item['desc'];
    }

    // process units
    $dataFile = file_get_contents('src/game_data/Data/units.csv');
    if ($dataFile === false) {
        throw new Exception('Failed to open units data file');
    }

    $filterCategories = [];
    $filterTypes = [];
    $filterChassis = [];
    $filterTraits = [];
    $filterSwitch = [];
    $filterFactions = [];
    $filterAvailable = '';
    $filterExpire = '';
    $units = [];
    $unitNames = [];
    $unitUpgradeGroups = [];
    $dataFile = explode("\n", $dataFile);
    foreach ($dataFile as $line) {
        $line = explode(";", $line);

        // remove garbage from data
        foreach ($line as $i => $word) {
            if (in_array($i, [16, 17])) {
                continue;
            }

            $line[$i] = str_replace('/', '', $word);
        }

        // check for valid ID, ignore empty lines and comments
        if (filter_var($line[1], FILTER_VALIDATE_INT) === false) {
            continue;
        }

        $id = $line[1];
        $name = $line[0];
        $category = $line[3];
        $type = $line[4];
        $chassis = $line[15];
        $cargo = (!empty($line[34])) ? (int) $line[34] : 0;
        $fuel = (!empty($line[25])) ? (int) $line[25] : 0;
        $blast = (!empty($line[33])) ? (int) $line[33] : 0;
        $steps = (int) $line[24];

        // collect all ids that belong to specific unit name
        $name = strtolower($name);
        if (array_key_exists($name, $unitNames)) {
            $unitNames[$name][] = $id;
        } else {
            $unitNames[$name] = [$id];
        }

        $filterCategories[$category] = $category;
        $filterTypes[$type] = $type;
        $filterChassis[$chassis] = $chassis;

        // reformat list so we could easily search in it later
        $listData = explode(',', $line[2]);

        $factions = [];
        foreach ($listData as $item) {
            // clean item (same data is malformed)
            $item = trim($item);
            if (empty($item)) {
                continue;
            }

            $factions[] = $item;
            $filterFactions[] = $item;
        }
        $factions = array_values($factions);

        $filterFactions = array_unique($filterFactions);

        $available = DateTime::createFromFormat('j/n/Y', $line[16]);
        $available = ($available) ? $available->format('U') : '';
        if ($available !== '' && ($filterAvailable === '' || $filterAvailable > $available)) {
            $filterAvailable = $available;
        }

        $expire = DateTime::createFromFormat('j/n/Y', $line[17]);
        $expire = ($expire) ? $expire->format('U') : '';
        if ($expire !== '' && ($filterExpire === '' || $filterExpire < $expire)) {
            $filterExpire = $expire;
        }

        $series = $line[18];
        if (!empty($series)) {
            $series = trim($series);
            foreach ($factions as $item) {
                if (!empty($unitUpgradeGroups[$item][$series])) {
                    $unitUpgradeGroups[$item][$series][] = $id;
                } else {
                    $unitUpgradeGroups[$item][$series] = [$id];
                }
            }
        } else {
            $series = '';
        }

        // reformat list so we could easily search in it later
        $listData = explode(',', $line[35]);
        $listData = array_diff($listData, ['', ' ']);

        $carrier = [];
        foreach ($listData as $item) {
            // clean item (same data is malformed)
            $item = str_replace(',', '', $item);
            $carrier[] = trim($item);
        }
        $carrier = array_values($carrier);

        // torpedo attack, range and cool-down
        $torpedo = (strpos($line[39], ',') !== false) ? explode(', ', $line[39]) : [];
        if (count($torpedo) > 0) {
            $torpedoCoolDown = (int) $torpedo[0];
            $torpedoRange = (int) $torpedo[1];
            $torpedoAttack = (int) $torpedo[2];
        } else {
            $torpedoCoolDown = 0;
            $torpedoRange = 0;
            $torpedoAttack = 0;
        }

        // infantry attack and close attack
        $attackData = $line[42];
        if (strpos($attackData, '-') !== false) {
            $attackData = explode('-', $attackData);
            $infantryAttack = $attackData[0];
            $infantryCloseAttack = $attackData[1];
        } else {
            $infantryAttack = $attackData;
            $infantryCloseAttack = $attackData;
        }

        // vehicle attack and close attack
        $attackData = $line[43];
        if (strpos($attackData, '-') !== false) {
            $attackData = explode('-', $attackData);
            $vehicleAttack = $attackData[0];
            $vehicleCloseAttack = $attackData[1];
        } else {
            $vehicleAttack = $attackData;
            $vehicleCloseAttack = $attackData;
        }

        // reformat list so we could easily search in it later
        $listData = explode(',', $line[56]);
        $listData = array_diff($listData, ['', ' ']);

        $traits = [];
        foreach ($listData as $item) {
            // clean item (same data is malformed)
            $item = str_replace(',', '', $item);
            $traits[] = trim($item);
        }

        // add type traits
        if (array_key_exists($type, $typeTraits)) {
            $traits = array_merge($traits, $typeTraits[$type]);
            $traits = array_unique($traits);
        }

        sort($traits, SORT_STRING);
        $traits = array_values($traits);

        // remove unnecessary traits
        if ($category == 'air' && $type == 'recon') {
            $traits = array_diff($traits, ['noEntrench', 'noCapture', 'quickRetreat', 'noSupply']);
        }

        // add additional traits based on unit attributes
        $extraTraits = [];
        if ($cargo > 0) {
            $extraTraits[] = 'Cargo Capacity: ' . $cargo;
        }

        if ($category == 'land' && $fuel > 0) {
            $extraTraits[] = 'Well Supplied';
        }

        if ($torpedoAttack > 0) {
            $extraTraits[] = 'Torpedo Launcher';
        }

        if ($category == 'land' && !in_array('spotter', $traits)) {
            $extraTraits[] = 'Limited Awareness';
        }

        if ($blast > 0) {
            $extraTraits[] = 'Splash Damage';
        }

        if ($steps > 1) {
            $extraTraits[] = 'Flexible Pathing';
        }

        if ($chassis == 'mountain') {
            $extraTraits[] = 'Mountain Gun';
        }

        if ($type == 'artillery' && !in_array('staticFire', $traits)) {
            $extraTraits[] = 'Rapid Deployment';
        }

        // add trait description
        $traitData = [];
        foreach ($traits as $item) {
            if (array_key_exists($item, $traitTrans)) {
                $traitName = $traitTrans[$item];
                $traitInfo = $traitsLocalised[$traitName];

                $traitData[] = [
                    'name' => $traitName,
                    'info' => $traitInfo,
                ];

                $filterTraits[] = $traitName;
            }
        }

        // process extra traits
        foreach ($extraTraits as $traitName) {
            if (array_key_exists($traitName, $traitsLocalised)) {
                $traitInfo = $traitsLocalised[$traitName];
            } elseif (array_key_exists($traitName, $customTraits)) {
                $traitInfo = $customTraits[$traitName];
            } else {
                $traitInfo = '';
            }

            $traitData[] = [
                'name' => $traitName,
                'info' => $traitInfo,
            ];

            $filterTraits[] = $traitName;
        }

        $filterTraits = array_unique($filterTraits);

        // process localised name, fall back to internal name if missing
        $nameLocalised = (array_key_exists($id, $unitNamesLocalised)) ? $unitNamesLocalised[$id] : $line[0];
        $nameLocalised = htmlspecialchars($nameLocalised);

        $units[$id] = [
            'id' => (int) $id,
            'name' => $line[0],
            'name_real' => $nameLocalised,
            'factions' => $factions,
            'category' => $category,
            'type' => $type,
            'chassis' => $chassis,
            'available' => $available,
            'expire' => $expire,
            'series' => $series,
            'cost' => (!empty($line[19])) ? (int) $line[19] : 0,
            'supply' => (int) $line[20],
            'movement' => (int) $line[22],
            'actions' => (int) $line[23],
            'steps' => $steps,
            'fuel' => $fuel,
            'range' => (!empty($line[27])) ? (int) $line[27] : 0,
            'spotting' => (int) $line[28],
            'radar' => (!empty($line[29])) ? (int) $line[29] : 0,
            'shock' => (!empty($line[30])) ? (int) $line[30] : 0,
            'assault' => (!empty($line[31])) ? (int) $line[31] : 0,
            'bombardment' => (!empty($line[32])) ? (int) $line[32] : 0,
            // attack blast (i.e. nuclear bomb)
            'blast' => $blast,
            // number of cargo slots for carriers
            'cargo' => $cargo,
            // carrier type (type of ships that can store this unit in cargo)
            'carrier' => $carrier,
            'unit_carrier' => [],
            'transport' => $line[36],
            'switch' => $line[37],
            'torpedo_attack' => $torpedoAttack,
            'torpedo_range' => $torpedoRange,
            'torpedo_cool_down' => $torpedoCoolDown,
            'attack_type' => $line[40],
            'defense_type' => $line[41],
            'infantry_attack' => (!empty($infantryAttack)) ? (int) $infantryAttack : 0,
            'infantry_close_attack' => (!empty($infantryCloseAttack)) ? (int) $infantryCloseAttack : 0,
            'vehicle_attack' => (!empty($vehicleAttack)) ? (int) $vehicleAttack : 0,
            'vehicle_close_attack' => (!empty($vehicleCloseAttack)) ? (int) $vehicleCloseAttack : 0,
            'air_attack_small' => (!empty($line[44])) ? (int) $line[44] : 0,
            'air_attack_large' => (!empty($line[45])) ? (int) $line[45] : 0,
            'naval_attack_small' => (!empty($line[46])) ?(int)  $line[46] : 0,
            'naval_attack_small_pg' => 0,
            'naval_attack_large' => (!empty($line[47])) ? (int) $line[47] : 0,
            'naval_attack_large_pg' => 0,
            'submarine_attack' => (!empty($line[48])) ? (int) $line[48] : 0,
            'infantry_defense' => (!empty($line[49])) ? (int) $line[49] : 0,
            'vehicle_defense' => (!empty($line[50])) ? (int) $line[50] : 0,
            'artillery_defense' => (!empty($line[51])) ? (int) $line[51] : 0,
            'air_defense' => (!empty($line[52])) ? (int) $line[52] : 0,
            'naval_defense' => (!empty($line[53])) ? (int) $line[53] : 0,
            'torpedo_defense' => (!empty($line[54])) ? (int) $line[54] : 0,
            'land_defense' => (!empty($line[55])) ? (int) $line[55] : 0,
            'traits' => $traitData,
            'specialisation' => (!empty($line[57])) ? strtolower($line[57]) : '',
            'switch_type' => [],
        ];
    }

    unset($unitNamesLocalised);

    // second iteration processing (unit references)
    foreach ($units as $id => $data) {
        $extraTraits = [];

        // process transport
        if (!empty($data['transport'])) {
            // reformat list
            $listData = explode(', ', $data['transport']);
            $listData = array_diff($listData, ['', ' ']);

            $transport = [];
            foreach ($listData as $item) {
                // remove garbage from unit name
                $item = str_replace(',', '', $item);

                // there are upper case and lower case variants, also some unit names do not actually have a record yet
                $itemName = $item;
                $item = strtolower($item);

                // replace unit name with list of ids
                $ids = (array_key_exists($item, $unitNames)) ? $unitNames[$item] : [-1];
                foreach ($ids as $itemId) {
                    $transport[] = [
                        'name' => $itemName,
                        'id' => (int) $itemId
                    ];
                }
            }

            $units[$id]['transport'] = $transport;
        } else {
            $units[$id]['transport'] = [];
        }

        // process unit switch
        if (!empty($data['switch'])) {
            // reformat list
            $listData = explode(',', $data['switch']);
            $listData = array_diff($listData, ['', ' ']);

            $switch = [];
            foreach ($listData as $item) {
                // remove garbage from unit name
                $item = str_replace(',', '', $item);
                if (strpos($item, ':') === false) {
                    continue;
                }

                // parse item action and item name
                $item = explode(':', $item);
                $action = trim($item[0]);
                $hasInnerImage = in_array($action, $actionImagesWithInnerImage);
                $action = ($action === 'amphibious' && $data['chassis'] !== 'amphibious') ? 'exitwater' : $action;
                $actionImage = $action;
                $actionImage = (array_key_exists($actionImage, $actionImgTrans)) ? $actionImgTrans[$actionImage] : $actionImage;
                $item = $item[1];

                // remove extra param
                if (strpos($item, ' ') !== false) {
                    $item = explode(' ', $item);
                    $extraParams = $item;
                    $item = $item[0];

                    // process extra params
                    array_shift($extraParams);
                    if (count($extraParams) > 0) {
                        $action = array_shift($extraParams);
                        $action = trim($action);
                    }
                }

                // action related traits
                if ($action == 'bomb') {
                    $extraTraits[] = 'Bomb Racks';
                } elseif ($action == 'ohka') {
                    $extraTraits[] = 'Ohka Carrier';
                } elseif ($action == 'torpedo') {
                    $extraTraits[] = 'Torpedo Capacity';
                } elseif ($action == 'primary_guns') {
                    $extraTraits[] = 'Big Gun Barrage';
                } elseif (in_array($action, ['amphibious', 'exitwater'])) {
                    $extraTraits[] = 'Amphibious';
                } elseif ($action == 'anti_air') {
                    $extraTraits[] = 'Anti-Air Mode';
                } elseif ($action == 'anti_tank') {
                    $extraTraits[] = 'Anti-Tank Mode';
                } elseif ($action == 'artillery') {
                    $extraTraits[] = 'Artillery Mode';
                } elseif ($action == 'rail') {
                    $extraTraits[] = 'Rail Setup';
                } elseif ($action == 'road') {
                    $extraTraits[] = 'Off-Rail Setup';
                }

                // there are upper case and lower case variants, also some unit names do not actually have a record yet
                $itemName = $item;
                $item = strtolower($item);

                // replace unit name with list of ids
                $ids = (array_key_exists($item, $unitNames)) ? $unitNames[$item] : [-1];
                foreach ($ids as $itemId) {
                    $itemId = (int) $itemId;

                    $switch[] = [
                        'name' => trim($itemName),
                        'action' => $action,
                        'img' => $actionImage,
                        'inner' => $hasInnerImage,
                        'id' => $itemId
                    ];

                    // mark referenced unit with switch type
                    if ($itemId > -1) {
                        $units[$itemId]['switch_type'][] = $action;
                        $units[$itemId]['switch_type'] = array_unique($units[$itemId]['switch_type']);
                    }
                }

                // primary guns (find primary guns unit via a reference and retrieve naval attack)
                if ($action === 'primary_guns') {
                    foreach ($ids as $itemId) {
                        if (!array_key_exists($itemId, $units)) {
                            continue;
                        }

                        $pgUnit = $units[$itemId];
                        $units[$id]['naval_attack_small_pg'] = $pgUnit['naval_attack_small'];
                        $units[$id]['naval_attack_large_pg'] = $pgUnit['naval_attack_large'];

                        // we grab the first unit we find
                        break;
                    }
                }

                $filterSwitch[] = $action;
            }


            $filterSwitch = array_unique($filterSwitch);
            $units[$id]['switch'] = $switch;
        } else {
            $units[$id]['switch'] = [];
        }

        // process carrier type
        if (!empty($data['carrier'])) {
            $carrier = [];
            $unitCarrier = [];

            // search for explicit carrier types(referenced by name)
            // remove unit references from the standard carrier list
            foreach ($data['carrier'] as $item) {
                if (in_array($item, $filterTypes)) {
                    $carrier[] = $item;
                } else {
                    $itemName = $item;
                    $item = strtolower($item);
                    $unitIds = (array_key_exists($item, $unitNames)) ? $unitNames[$item] : [0];
                    foreach ($unitIds as $unitId) {
                        $unitCarrier[] = [
                            'name' => $itemName,
                            'id' => (int) $unitId
                        ];
                    }
                }
            }

            $units[$id]['carrier'] = $carrier;
            $units[$id]['unit_carrier'] = $unitCarrier;

            // catapult launched trait
            if (in_array('battleship', $carrier) || in_array('cruiser', $carrier)) {
                $extraTraits[] = 'Catapult-Launched';
            }
        }

        // process series
        $units[$id]['series'] = [];
        if (!empty($data['series'])) {
            foreach ($unitUpgradeGroups as $faction => $factionData) {
                foreach ($factionData as $series => $ids) {
                    if (in_array($id, $ids)) {
                        $units[$id]['series'][$faction] = $ids;
                    }
                }
            }
        }

        // process extra traits
        $traitData = [];
        foreach ($extraTraits as $traitName) {
            $traitInfo = (array_key_exists($traitName, $traitsLocalised)) ? $traitsLocalised[$traitName] : '';

            $traitData[] = [
                'name' => $traitName,
                'info' => $traitInfo
            ];

            $filterTraits[] = $traitName;
        }

        $filterTraits = array_unique($filterTraits);
        $traits =  array_merge($data['traits'], $traitData);

        // sort traits by name
        usort($traits, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });

        $units[$id]['traits'] = $traits;
    }

    unset($unitUpgradeGroups);

    $itemsTotal = count($units);
    $pagesTotal = ceil($itemsTotal / $itemsPerPage);
    if (array_key_exists('p', $_GET)) {
        $currentPage = filter_var($_GET['p'], FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 0,
                'min_range' => 0,
            ]
        ]);
    } else {
        $currentPage = 0;
    }

    // store ordered ids so we can use them to sort later, JS will change the order of the unit data when parsing JSON
    $unitsOrdered = array_keys($units);

    // preselected compare unit
    if (array_key_exists('c', $_GET)) {
        $compare = filter_var($_GET['c'], FILTER_VALIDATE_INT);
        $compare = ($compare !== false && in_array($compare, $unitsOrdered)) ? $compare : -1;
    } else {
        $compare = -1;
    }

    $unitsOrdered = json_encode($unitsOrdered);
    $units = json_encode($units);

    // unit data only request via AJAX
    if (!empty($_REQUEST['units-data'])) {
        header('Content-Type: application/json; charset=utf-8');
        echo $units;
        exit();
    }

    sort($filterCategories, SORT_STRING);
    sort($filterTypes, SORT_STRING);
    sort($filterChassis, SORT_STRING);
    sort($filterFactions, SORT_STRING);
    sort($filterTraits, SORT_STRING);
    sort($filterSwitch, SORT_STRING);

    // sort terrain data
    foreach ($terrain as $climate => $climateData) {
        ksort($climateData, SORT_STRING);
        $terrain[$climate] = $climateData;
    }

    header('Content-Type: text/html;charset=UTF-8');

    $html = '<!DOCTYPE html>';
    $html.= '<html lang="en" xml:lang="en">';
    $html.= '<head>';
    $html.= '<meta charset="UTF-8" />';
    $html.= '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
    $html.= '<meta name="description" content="Order of Battle Game Data Viewer" />';
    $html.= '<meta name="author" content="Mojmír Fendek" />';
    $html.= '<meta name="keywords" content="Order of Battle, game data viewer" />';
    $html.= '<link rel="icon" href="src/game_data/Graphics/UI/resource_specs.png?v=' . $version . '" type="image/png" />';
    $html.= '<link rel="stylesheet" href="src/styles/css/main.css?v=' . $version . '" type="text/css" title="standard style" />';
    $html.= '<script src="src/js/dist/main.js?v=' . $version . '"></script>';
    $html.= '<title>Unit Navigator - Order Of Battle</title>';

    $html.= '</head>';

    $html.= '<body>';

    $html.= '<h1><a href="' . $baseUrl . '">Unit Navigator - Order Of Battle</a></h1>';
    $html.= '<noscript>';
    $html.= '<div class="no-script">This application requires JavaScript, please turn it on to use this application</div>';
    $html.= '</noscript>';

    $html.= '<div class="filter-bar hidden">';

    $html.= '<input type="text" name="filter-unit-id" class="form-control" placeholder="unit id or ids (id1,id2)...">';

    $html.= '<input type="text" name="filter-unit-name" class="form-control" placeholder="unit name...">';

    $html.= '<select name="filter-category" class="form-control">';

    $html.= '<option value="">category</option>';
    foreach ($filterCategories as $item) {
        $html.= '<option value="' . $item . '">' . $item . '</option>';
    }
    $html.= '</select>';

    $html.= '<select name="filter-type" class="form-control">';
    $html.= '<option value="">type</option>';
    foreach ($filterTypes as $item) {
        $html.= '<option value="' . $item . '">' . $item . '</option>';
    }
    $html.= '</select>';

    $html.= '<select name="filter-faction" class="form-control">';
    $html.= '<option value="">faction</option>';
    foreach ($filterFactions as $item) {
        $html.= '<option value="' . $item . '">' . $item . '</option>';
    }
    $html.= '</select>';

    $html.= '<select name="filter-chassis" class="form-control">';
    $html.= '<option value="">chassis</option>';
    foreach ($filterChassis as $item) {
        $html.= '<option value="' . $item . '">' . $item . '</option>';
    }
    $html.= '</select>';

    $html.= '<select name="filter-trait" class="form-control">';
    $html.= '<option value="">unit trait</option>';
    foreach ($filterTraits as $item) {
        $html.= '<option value="' . $item . '">' . $item . '</option>';
    }
    $html.= '</select>';

    $html.= '<select name="filter-switch" class="form-control">';
    $html.= '<option value="">unit switch</option>';
    $html.= '<option value="none">none</option>';
    foreach ($filterSwitch as $item) {
        $html.= '<option value="' . $item . '">' . $item . '</option>';
    }
    $html.= '</select>';

    $html.= '<input type="date" name="filter-available" class="form-control"'
        . (($filterAvailable !== '') ? ' min="' . date('Y-m-d', $filterAvailable) . '"' : '')
        . (($filterExpire !== '') ? ' max="' . date('Y-m-d', $filterExpire) . '"' : '') . '/>';

    $html.= '<button type="button" name="clear-filters" class="btn btn-info">Clear filters</button>';

    $html.= '<button type="button" name="clear-compare" class="btn btn-warning hidden">Clear compare</button>';

    $html.= '<a class="compare-label hidden" href=""><span></span></a>';

    $html.= '</div>';

    $html.= '<div class="navigation-bar hidden">';

    $html.= '<ul class="pagination">';
    $html.= '<li class="first-page"><a href="#">First</a></li>';
    $html.= '<li class="previous-page"><a href="#">Previous</a></li>';
    $html.= '<li class="active">';
    $html.= '<a href="#">';
    $html.= '<span id="current-page">' . $currentPage . '</span> / <span id="pages-total" data-items-per-age="' . $itemsPerPage . '">' . $pagesTotal . '</span>';
    $html.= '</a>';
    $html.= '</li>';
    $html.= '<li id="filter-permalink"><a href="' . $baseUrl . '">Permalink</a></li>';
    $html.= '<li class="next-page"><a href="#">Next</a></li>';
    $html.= '<li class="last-page"><a href="#">Last</a></li>';
    $html.= '</ul>';
    $html.= '</div>';

    $html.= '<div id="units-list" class="units-list hidden"></div>';

    $html.= '<div class="navigation-bar hidden">';
    $html.= '<ul class="pagination">';
    $html.= '<li class="first-page"><a href="#">First</a></li>';
    $html.= '<li class="previous-page"><a href="#">Previous</a></li>';
    $html.= '<li class="active">';
    $html.= '<a href="#">';
    $html.= '<span id="current-page-bottom">' . $currentPage . '</span> / <span id="pages-total-bottom">' . $pagesTotal . '</span>';
    $html.= '</a>';
    $html.= '</li>';
    $html.= '<li class="next-page"><a href="#">Next</a></li>';
    $html.= '<li class="last-page"><a href="#">Last</a></li>';
    $html.= '</ul>';
    $html.= '</div>';

    $html.= '<div class="version-info" data-version="' . $version . '">Version: ' . $version . '</div>';

    $html.= '<div id="units-data-ordered" class="hidden">' . $unitsOrdered .'</div>';
    $html.= '<div id="terrain-data-file" class="hidden">' . json_encode($terrain) .'</div>';

    if (count($selectedFilters) > 0) {
        $html.= '<div id="preselected-filters" class="hidden">' . json_encode($selectedFilters) .'</div>';
    }

    if ($compare >= 0) {
        $html.= '<div id="preselected-compare" class="hidden">' . $compare .'</div>';
    }

    $html.= '<div id="spinner" class="spinner"><img src="src/img/spinner.gif" alt="spinner"/></div>';

    $html.= '</body>';

    $html.= '</html>';
    $html.= sprintf(
        '<!-- Page generated in %.2f ms, memory used %.2f MB -->',
        (microtime(true) - $startTime),
        memory_get_usage() / (1024 * 1024)
    );

    // WS formatting
    $dom = new DOMDocument();
    $dom->preserveWhiteSpace = false;
    $dom->loadHTML($html);
    $dom->formatOutput = true;
    $html = $dom->saveHTML($dom);

    // output HTML
    echo $html;
}
catch (Exception $e) {
    error_log('OOB viewer Fatal error: ' . $e->getMessage());

    while (ob_get_level()) {
        ob_end_clean();
    }

    header('HTTP/1.1 500 Internal Server Error');
    echo "Unexpected Error. Sorry, try again later.\n";

    // exit with error status
    exit(1);
}
