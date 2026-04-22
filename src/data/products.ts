export type ProductCategory = 'All' | 'Drone Frames' | 'Mounts' | 'Guards' | 'Robotics'

export type Product = {
  id: string
  name: string
  desc: string
  price: string
  badge?: 'New' | 'Hot' | 'Sale'
  color: string
  category: Exclude<ProductCategory, 'All'>
  shape: 'frame' | 'disc' | 'mount' | 'tube' | 'plate' | 'leg' | 'chassis' | 'bracket'
}

export const products: Product[] = [
  {
    id: 'quad-x5',
    name: 'Quad Drone Frame X5',
    desc: '5" racing quad frame, 210mm wheelbase, 4mm arms',
    price: '₹1,450',
    badge: 'New',
    color: '#00f5ff',
    category: 'Drone Frames',
    shape: 'frame',
  },
  {
    id: 'prop-guard-5',
    name: 'Prop Guard Set (5")',
    desc: 'Protective prop guards for 5" props. Flexible TPU.',
    price: '₹380',
    badge: 'Hot',
    color: '#ff6b35',
    category: 'Guards',
    shape: 'disc',
  },
  {
    id: 'gopro-tilt',
    name: 'GoPro Tilt Mount',
    desc: 'Adjustable 0–45° camera tilt. Works with GoPro Hero series.',
    price: '₹280',
    color: '#00d4aa',
    category: 'Mounts',
    shape: 'mount',
  },
  {
    id: 'motor-mount',
    name: 'Motor Mount Arm',
    desc: 'Replacement motor arm, 10mm tube, 220mm length.',
    price: '₹220',
    color: '#7c6fff',
    category: 'Mounts',
    shape: 'tube',
  },
  {
    id: 'fpv-plate',
    name: 'FPV Camera Plate',
    desc: 'Universal FPV camera plate for 19mm/25mm cameras.',
    price: '₹195',
    badge: 'Sale',
    color: '#ff6b35',
    category: 'Mounts',
    shape: 'plate',
  },
  {
    id: 'landing-leg',
    name: 'Landing Leg Kit',
    desc: '4-piece retractable landing legs, 200g payload capacity.',
    price: '₹450',
    color: '#00f5ff',
    category: 'Drone Frames',
    shape: 'leg',
  },
  {
    id: 'rc-chassis',
    name: 'RC Car Chassis',
    desc: 'Modular robot chassis, 4WD, fits Raspberry Pi mount.',
    price: '₹890',
    color: '#00d4aa',
    category: 'Robotics',
    shape: 'chassis',
  },
  {
    id: 'servo-bracket',
    name: 'Servo Bracket',
    desc: 'Multi-angle servo horn bracket for robotic arm builds.',
    price: '₹120',
    color: '#7c6fff',
    category: 'Robotics',
    shape: 'bracket',
  },
]

export const categories: ProductCategory[] = [
  'All',
  'Drone Frames',
  'Mounts',
  'Guards',
  'Robotics',
]
