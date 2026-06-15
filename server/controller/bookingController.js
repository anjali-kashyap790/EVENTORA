const Booking = require('../models/Booking');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const {sendOTPEmail, sendBookingEmail} = require('../utils/email');

const generateOtp =() => {
    return Math.floor(100000+Math.random()*900000).toString();
}

exports.sendBookingOTP = async(req, res) => {
    try {
        const otp = generateOtp();
        await OTP.findOneAndDelete({email:req.user.email, action: 'event_booking'});
        await OTP.create({email: req.user.email, otp, action: 'event_booking'});
        await sendOTPEmail(req.user.email, otp, 'event_booking');
        res.json({message: 'OTP sent to email'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.bookEvent = async(req, res) => {
    const {eventId, otp} = req.body;

    try {
        const otpRecord = await OTP.findOne({email: req.user.email, otp, action: 'event_booking'});
        if(!otpRecord) {
            return res.status(400).json({error: 'Invalid or expired OTP'});
        }
        const event = await Event.findById(eventId);
        if(!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        
        if(event.availableSeats <= 0) {
            return res.status(400).json({error: 'No seats available'});
        }
         
        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: 'pending',
            paymentStatus: 'non_paid',
            amount: event.ticketPrice
        });

        await OTP.deleteMany({email: req.user.email, action: 'event_booking'});
        res.status(201).json({message: 'Booking created successfully. Admin will confirm shortly.'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.confirmBooking = async(req,res) => {
    const paymentStatus = req.body.paymentStatus;
    if(paymentStatus && !['paid', 'non_paid'].includes(paymentStatus)){
        return res.status(400).json({error: 'Invalid payment status'});
    }

    try {
        const booking = await Booking.findById(req.params.id).populate('eventId').populate('userId');
        if(!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        if(booking.status === 'confirmed') {
            return res.status(400).json({error: 'Booking is already confirmed'});
        }

        const event = await Event.findById(booking.eventId._id);
        if(!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        if(event.availableSeats <= 0) {
            return res.status(400).json({error: 'No seats available'});
        }

        booking.status = 'confirmed';

        if(paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();
        event.availableSeats -= 1;
        await event.save();

        const userEmail = booking.userId ? booking.userId.email : req.user.email;
        const userName = booking.userId ? booking.userId.name : 'User';

        // admin confirm booking, send email to user
        await sendBookingEmail(userEmail, userName, event.title);

        res.json({message: 'Booking confirmed'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('eventId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyBookings = async(req,res) => {
    try {
        const bookings=await Booking.find({userId: req.user._id}).populate('eventId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.cancelBooking = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        if(booking.userId.toString()!==req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({error: 'Unauthorized'});
        }
        
        const wasConfirmed = booking.status === 'confirmed';
        booking.status = 'cancelled';
        await booking.save();

        // If anyone cancel ticket then we have to add one more seat.
        if(wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }
        
        await booking.deleteOne();
        res.json({message: 'Booking cancelled'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}