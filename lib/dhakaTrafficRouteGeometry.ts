export type TrafficPoint = readonly [number, number];

// Ten long survey circuits. Each point is a major road junction and is sent to
// the router as a required via point. Together they cover the main north–south,
// east–west, Airport Road, Mirpur Road, Pragati Sarani, and Old Dhaka highways.
export const DHAKA_TRAFFIC_ROUTE_WAYPOINTS: Record<string, readonly TrafficPoint[]> = {
  "airport-railway-gabtoli": [[90.3443,23.7836],[90.3610,23.7779],[90.3680,23.8060],[90.4008,23.8218],[90.4080,23.8520],[90.4190,23.8210],[90.4231,23.7944],[90.4210,23.7630],[90.3985,23.7926],[90.3909,23.7585],[90.3797,23.7781],[90.3443,23.7836]],
  "airport-railway-kamalapur": [[90.4080,23.8520],[90.4190,23.8210],[90.4231,23.7944],[90.4210,23.7630],[90.4340,23.7110],[90.4110,23.7090],[90.4050,23.7180],[90.3950,23.7380],[90.3909,23.7585],[90.3985,23.7926],[90.4008,23.8218],[90.4080,23.8520]],
  "airport-road": [[90.4080,23.8520],[90.4008,23.8218],[90.3985,23.7926],[90.3909,23.7585],[90.3950,23.7380],[90.4050,23.7180],[90.4110,23.7090],[90.4340,23.7110],[90.4210,23.7630],[90.4231,23.7944],[90.4190,23.8210],[90.4080,23.8520]],
  "mirpur-road": [[90.3443,23.7836],[90.3290,23.7950],[90.3443,23.7836],[90.3598,23.7792],[90.3671,23.7684],[90.3743,23.7585],[90.3798,23.7490],[90.3834,23.7388],[90.4050,23.7180],[90.4340,23.7110],[90.4210,23.7630],[90.4231,23.7944],[90.3985,23.7926],[90.3680,23.8060],[90.3443,23.7836]],
  "kazi-nazrul-islam-avenue": [[90.3909,23.7585],[90.3972,23.7515],[90.3984,23.7444],[90.3950,23.7380],[90.4050,23.7180],[90.4110,23.7090],[90.4340,23.7110],[90.4210,23.7630],[90.4120,23.7587],[90.3985,23.7926],[90.3797,23.7781],[90.3680,23.8060],[90.3610,23.7779],[90.3443,23.7836],[90.3909,23.7585]],
  "begum-rokeya-sarani": [[90.3680,23.8060],[90.3706,23.7976],[90.3737,23.7897],[90.3797,23.7781],[90.3909,23.7585],[90.3985,23.7926],[90.4008,23.8218],[90.4080,23.8520],[90.4190,23.8210],[90.4231,23.7944],[90.3985,23.7926],[90.3680,23.8060]],
  "pragati-sarani": [[90.4190,23.8210],[90.4231,23.7944],[90.4216,23.7828],[90.4210,23.7630],[90.4340,23.7110],[90.4540,23.7310],[90.4470,23.7550],[90.4210,23.7630],[90.4120,23.7587],[90.3985,23.7926],[90.4008,23.8218],[90.4190,23.8210]],
  "sat-masjid-road": [[90.3443,23.7836],[90.3290,23.7950],[90.3180,23.7800],[90.3443,23.7836],[90.3580,23.7580],[90.3686,23.7468],[90.3755,23.7407],[90.3834,23.7388],[90.3950,23.7380],[90.4050,23.7180],[90.4110,23.7090],[90.3850,23.7250],[90.3670,23.7440],[90.3580,23.7580],[90.3443,23.7836]],
  "gulshan-avenue": [[90.4140,23.7940],[90.4160,23.7810],[90.4231,23.7944],[90.4210,23.7630],[90.4340,23.7110],[90.4110,23.7090],[90.4050,23.7180],[90.3950,23.7380],[90.4120,23.7587],[90.3985,23.7926],[90.4008,23.8218],[90.4080,23.8520],[90.4190,23.8210],[90.4140,23.7940]],
  "hatirjheel-road": [[90.3443,23.7836],[90.3580,23.7580],[90.3909,23.7585],[90.3985,23.7926],[90.4080,23.8520],[90.4190,23.8210],[90.4231,23.7944],[90.4210,23.7630],[90.4540,23.7310],[90.4340,23.7110],[90.4110,23.7090],[90.4050,23.7180],[90.3834,23.7388],[90.3670,23.7440],[90.3443,23.7836]],
};

export const DHAKA_TRAFFIC_ROUTE_JUNCTIONS: Record<string, readonly string[]> = {
  "airport-railway-gabtoli": ["Gabtoli","Kallyanpur","Mirpur 10","Kakoli","Airport","Kuril","Badda","Rampura","Mohakhali","Farmgate","Agargaon","Gabtoli"],
  "airport-railway-kamalapur": ["Airport","Kuril","Badda","Rampura","Jatrabari","Sadarghat","Babubazar","Shahbag","Farmgate","Mohakhali","Kakoli","Airport"],
  "airport-road": ["Airport","Kakoli","Mohakhali","Farmgate","Shahbag","Babubazar","Sadarghat","Jatrabari","Rampura","Badda","Kuril","Airport"],
  "mirpur-road": ["Gabtoli","Amin Bazar","Gabtoli","Kallyanpur","Shyamoli","Asad Gate","Dhanmondi 27","Science Lab","Babubazar","Jatrabari","Rampura","Badda","Mohakhali","Mirpur 10","Gabtoli"],
  "kazi-nazrul-islam-avenue": ["Farmgate","Karwan Bazar","Banglamotor","Shahbag","Babubazar","Sadarghat","Jatrabari","Rampura","Moghbazar","Mohakhali","Agargaon","Mirpur 10","Kallyanpur","Gabtoli","Farmgate"],
  "begum-rokeya-sarani": ["Mirpur 10","Kazipara","Shewrapara","Agargaon","Farmgate","Mohakhali","Kakoli","Airport","Kuril","Badda","Mohakhali","Mirpur 10"],
  "pragati-sarani": ["Kuril","Badda","Shahjadpur","Rampura","Jatrabari","Demra","Staff Quarter","Rampura","Moghbazar","Mohakhali","Kakoli","Kuril"],
  "sat-masjid-road": ["Gabtoli","Amin Bazar","Hemayetpur link","Gabtoli","Mohammadpur","Dhanmondi 27","Jigatola","Science Lab","Shahbag","Babubazar","Sadarghat","Hazaribagh","Dhanmondi","Mohammadpur","Gabtoli"],
  "gulshan-avenue": ["Gulshan 2","Gulshan 1","Badda","Rampura","Jatrabari","Sadarghat","Babubazar","Shahbag","Moghbazar","Mohakhali","Kakoli","Airport","Kuril","Gulshan 2"],
  "hatirjheel-road": ["Gabtoli","Mohammadpur","Farmgate","Mohakhali","Airport","Kuril","Badda","Rampura","Demra","Jatrabari","Sadarghat","Babubazar","Science Lab","Dhanmondi","Gabtoli"],
};
