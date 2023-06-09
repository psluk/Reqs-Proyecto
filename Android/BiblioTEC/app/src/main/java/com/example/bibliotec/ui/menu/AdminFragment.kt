package com.example.bibliotec.ui.menu

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.bibliotec.R
import com.example.bibliotec.api.ApiRequest
import com.example.bibliotec.databinding.FragmentAdminBinding
import com.example.bibliotec.misc.LocalDate
import com.example.bibliotec.user.User
import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class AdminFragment : Fragment() {

    private var _binding: FragmentAdminBinding? = null
    private lateinit var apiRequest : ApiRequest
    private val binding get() = _binding!!
    private val gson = Gson()
    private lateinit var user : User

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val activity = requireActivity() as AppCompatActivity
        activity.supportActionBar?.setDisplayHomeAsUpEnabled(false)

        _binding = FragmentAdminBinding.inflate(inflater, container, false)
        apiRequest = ApiRequest.getInstance(requireContext())
        user = User.getInstance(requireContext())
        return binding.root

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Listeners para quitar la sombra al tocar el botón
        view.findViewById<ConstraintLayout>(R.id.ManageStudentsButton).setOnTouchListener { view, event ->
            buttonPressed(view, event)
            false
        }

        view.findViewById<ConstraintLayout>(R.id.AddRoomButton).setOnTouchListener { view, event ->
            buttonPressed(view, event)
            false
        }

        view.findViewById<ConstraintLayout>(R.id.ManageRoomsButton).setOnTouchListener { view, event ->
            buttonPressed(view, event)
            false
        }

        view.findViewById<ConstraintLayout>(R.id.ManageReservationsButton).setOnTouchListener { view, event ->
            buttonPressed(view, event)
            false
        }

        // Se agregan los listeners al tocar
        view.findViewById<ConstraintLayout>(R.id.ManageStudentsButton).setOnClickListener {
            findNavController().navigate(R.id.action_AdminFragment_to_studListFragment)
        }

        view.findViewById<ConstraintLayout>(R.id.AddRoomButton).setOnClickListener {
            findNavController().navigate(R.id.action_AdminFragment_to_NewRoomFragment)
        }

        view.findViewById<ConstraintLayout>(R.id.ManageRoomsButton).setOnClickListener {
            findNavController().navigate(R.id.action_AdminFragment_to_cubiListFragment)
        }

        view.findViewById<ConstraintLayout>(R.id.ManageReservationsButton).setOnClickListener {
            findNavController().navigate(R.id.action_AdminFragment_to_BookingListFragment)
        }

        // Si no se ha revisado el estado de la sesión desde que se abrió la aplicación,
        // se revisa aquí
        if (!user.checkedInCurrentSession()) {
            GlobalScope.launch(Dispatchers.IO) {
                val url = "https://appbibliotec.azurewebsites.net/api/login"

                val (responseStatus, responseString) = apiRequest.getRequest(url)
                if (responseStatus) {
                    val json = gson.fromJson(responseString, JsonObject::class.java)

                    if (json.has("loggedIn") && json.get("loggedIn").asBoolean) {
                        // El usuario continúa con la sesión activa
                        user.setCheckedInCurrentSession()
                    } else {
                        // Ya se cerró la sesión
                        user.setTimedOut()
                        requireActivity().runOnUiThread {
                            AlertDialog.Builder(requireContext())
                                .setTitle(R.string.session_timeout_title)
                                .setMessage(R.string.session_timeout)
                                .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
                                .show()
                            findNavController().navigate(R.id.action_AdminFragment_to_LoginFragment)
                        }
                    }

                } else {
                    requireActivity().runOnUiThread {
                        AlertDialog.Builder(requireContext())
                            .setTitle("Error")
                            .setMessage(responseString)
                            .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
                            .show()
                    }
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun buttonPressed(view: View, event: MotionEvent) {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                // When pressed, set the elevation to 0
                view.elevation = 0f
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                // When released or canceled, restore the default elevation
                view.elevation = resources.getDimension(R.dimen.default_elevation)
            }
        }
    }

    private fun notImplementedWarning() {
        AlertDialog.Builder(requireContext())
            .setTitle("Advertencia")
            .setMessage("Esta función aún no ha sido implementada")
            .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
            .show()
    }
}