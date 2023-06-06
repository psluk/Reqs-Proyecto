package com.example.bibliotec.ui

import android.app.AlertDialog
import android.app.ProgressDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bibliotec.R
import com.example.bibliotec.api.ApiRequest
import com.example.bibliotec.data.BookingItem
import com.example.bibliotec.data.RoomItem
import com.example.bibliotec.databinding.FragmentBookingListBinding
import com.example.bibliotec.user.User
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class BookingListFragment : Fragment() {
    private var _binding: FragmentBookingListBinding? = null
    private val binding get() = _binding!!
    private lateinit var apiRequest: ApiRequest
    private lateinit var user: User
    private val gson = Gson()
    private lateinit var recyclerView: RecyclerView
    private lateinit var bookingItemList : MutableList<BookingItem>
    private lateinit var completeBookingItemList : List<BookingItem>
    private val elementsPerPage = 15

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentBookingListBinding.inflate(inflater, container, false)
        apiRequest = ApiRequest.getInstance(requireContext())

        bookingItemList = mutableListOf()
        completeBookingItemList = listOf()

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Se debe cargar la lista de servicios
        recyclerView = view.findViewById(R.id.booking_list_recycler)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        val adapter = BookingListAdapter(bookingItemList)
        recyclerView.adapter = adapter

        // Se agrega un listener para agregar elementos a la lista al hacer scroll al final
        val progress = view.findViewById<ProgressBar>(R.id.progressBar)
        progress.visibility = View.VISIBLE

        recyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrollStateChanged(recyclerView: RecyclerView, newState: Int) {
                super.onScrollStateChanged(recyclerView, newState)
                if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                    val layoutManager = recyclerView.layoutManager as LinearLayoutManager
                    val lastVisibleItemPosition = layoutManager.findLastVisibleItemPosition()
                    val totalItemCount = layoutManager.itemCount

                    if (bookingItemList.isNotEmpty() && lastVisibleItemPosition == totalItemCount - 1 && completeBookingItemList.size > bookingItemList.size) {
                        // Se cargan más elementos
                        val endIndex = (totalItemCount + elementsPerPage).coerceAtMost(completeBookingItemList.size)

                        bookingItemList.addAll(completeBookingItemList.subList(totalItemCount, endIndex))
                        adapter.notifyItemRangeInserted(totalItemCount, endIndex)

                        if (completeBookingItemList.size <= bookingItemList.size) {
                            progress.visibility = View.GONE
                        }
                    }
                }
            }
        })

        GlobalScope.launch(Dispatchers.IO) {
            val url = "https://appbibliotec.azurewebsites.net/api/reserva/reservas"

            val (responseStatus, responseString) = apiRequest.getRequest(url)

            if (responseStatus) {
                completeBookingItemList = gson.fromJson(responseString, Array<BookingItem>::class.java).toList()

                if (completeBookingItemList.isNullOrEmpty()) {
                    val message = "No hay reservas existentes"
                    requireActivity().runOnUiThread() {
                        AlertDialog.Builder(requireContext())
                            .setTitle("Sin resultados")
                            .setMessage(message)
                            .setPositiveButton("OK") { dialog, _ ->
                                dialog.dismiss()
                                findNavController().navigateUp()
                            }
                            .show()
                    }
                } else {
                    val endIndex = elementsPerPage.coerceAtMost(completeBookingItemList.size)
                    bookingItemList.addAll(completeBookingItemList.subList(0, endIndex))

                    requireActivity().runOnUiThread() {
                        adapter.notifyItemRangeInserted(0, endIndex)

                        if (endIndex == completeBookingItemList.size) {
                            progress.visibility = View.GONE
                        }
                    }
                }
            } else {
                if (user.isLoggedIn()) {
                    // Ocurrió un error al hacer la consulta
                    requireActivity().runOnUiThread() {
                        AlertDialog.Builder(requireContext())
                            .setTitle("Error")
                            .setMessage(responseString)
                            .setPositiveButton("OK") { dialog, _ ->
                                dialog.dismiss()
                                findNavController().navigateUp()
                            }
                            .show()
                    }
                } else {
                    // La sesión expiró
                    requireActivity().runOnUiThread() {
                        AlertDialog.Builder(requireContext())
                            .setTitle(R.string.session_timeout_title)
                            .setMessage(R.string.session_timeout)
                            .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
                            .show()
                        findNavController().navigate(R.id.LoginFragment)
                    }
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}